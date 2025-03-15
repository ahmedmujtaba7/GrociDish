import { User } from '../entities/User';
import { AppDataSource } from "../config/db.config";

export const getCaloricInfo = async( userId : number) => {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['healthProfile', 'healthProfile.caloricInformation'], // Include relationships
    });

    const healthProfile = user?.healthProfile;

    const caloricInformation = healthProfile?.caloricInformation;
    console.log("calories api is being hit")
    return caloricInformation;
};

