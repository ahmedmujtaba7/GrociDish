import { AppDataSource } from "../config/db.config";
import { GroceryList } from "../entities/Grocery";
import { FamilyMember } from "../entities/FamilyMember";
import { Family } from "../entities/Family";
import { HealthProfile } from "../entities/HealthProfile";
import axios from "axios";

export class GroceryListService {
  // **Generate and Store Grocery List**
  static async generateGroceryList(userId: number, budget: number) {
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
    const groceryRepo = AppDataSource.getRepository(GroceryList);
    const healthProfileRepo = AppDataSource.getRepository(HealthProfile);

    try {
      // **Find Family of User**
      const familyMember = await familyMemberRepo.findOne({
        where: { user: { id: userId } },
        relations: ["family"],
      });

      if (!familyMember || !familyMember.family) {
        return { success: false, message: "User does not belong to any family" };
      }

      const familyId = familyMember.family.id;

      // **Get Family Member Count Directly from Family**
      const family = await AppDataSource.getRepository(Family).findOne({
        where: { id: familyId },
        select: ["member_count"],
      });

      if (!family) {
        return { success: false, message: "Family not found" };
      }

      const familyMembersCount = family.member_count;

      // **Get Diseases from Family Members**
      const healthProfiles = await healthProfileRepo.find({
        where: { user: { family: { id: familyId } } },
        select: ["diseases"],
      });

      const diseasesSet = new Set<string>();
      healthProfiles.forEach((profile) => {
        profile.diseases?.forEach((disease) => diseasesSet.add(disease));
      });

      const diseases = Array.from(diseasesSet);
      console.log("📌 Detected Diseases:", diseases);

      // **Prepare Payload for Flask API**
      const flaskPayload = {
        budget: Number(budget), // ✅ Ensure budget is a number
        family_members: Number(familyMembersCount), // ✅ Ensure family_members is a number
        diseases: Array.isArray(diseases) ? diseases : [], // ✅ Ensure diseases is an array
      };

      console.log("🚀 Sending request to Flask API with:", flaskPayload);

      // **Call Flask API**
      try {
        const flaskAPI = "http://localhost:5000/generate";
        const flaskResponse = await axios.post(flaskAPI, flaskPayload, {
          headers: { "Content-Type": "application/json" },
          timeout: 100000000,
        });

        if (!flaskResponse.data) {
          return { success: false, message: "Failed to get response from AI model" };
        }

        console.log("✅ AI Model Response:", flaskResponse.data.grocery_list);

        // **Store Grocery List in Database**
        const newGroceryList = groceryRepo.create({
          family: { id: familyId },
          budget: flaskPayload.budget, // ✅ Store corrected budget
          grocery_list: flaskResponse.data.grocery_list, // Assuming grocery_list is a JSON column
        });

        await groceryRepo.save(newGroceryList);

        return { success: true, message: "Grocery list generated successfully!", data: newGroceryList };
      } catch (flaskError) {
        console.error("❌ Error calling Flask API:", flaskError);
        return { success: false, message: "Error fetching data from AI model" };
      }
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      return { success: false, message: "Database error occurred" };
    }
  }

  // **Get Grocery List by User ID**
  static async getGroceryListByUser(userId: number) {
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
    const groceryRepo = AppDataSource.getRepository(GroceryList);

    // **Find Family ID**
    const familyMember = await familyMemberRepo.findOne({
      where: { user: { id: userId } },
      relations: ["family"],
    });

    if (!familyMember || !familyMember.family) {
      return { success: false, message: "User does not belong to any family" };
    }

    // **Get Latest Grocery List for Family**
    const groceryList = await groceryRepo.findOne({
      where: { family: { id: familyMember.family.id } },
      order: { created_at: "DESC" }, // Get the latest grocery list
    });

    if (!groceryList) {
      return { success: false, message: "No grocery list found for this family" };
    }

    return { success: true, data: groceryList };
  }
}
