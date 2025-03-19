import { AppDataSource } from '../config/db.config';
import { User } from '../entities/User';
import { Recipe } from '../entities/Recipe';

/**
 * Service to generate a grocery list for a user.
 */

interface Grocery { 
    id: number;
    userId: number;
    budget: number;
    diseases: string;
}
export const createGroceryList = async (userId: number, budget: number, diseases: string): Promise<Grocery> => {
    const groceryRepository = AppDataSource.getRepository(Grocery);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['groceryList'],
    });

    if (!user) {
        throw new Error('User not found');
    }

    const newGroceryList = groceryRepository.create({
        userId: userId,
        budget: budget,
        diseases: diseases,
    });
    await groceryRepository.save(newGroceryList);

    return newGroceryList;

};

export const getGroceryList = async (userId: number): Promise<Grocery> => {
    const groceryRepository = AppDataSource.getRepository(Grocery);
    const user = await groceryRepository.findOne({
        where: { userId: userId },
    });

    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

export const updateGroceryList = async (userId: number, groceryListId: number, groceryItems: string[]): Promise<void> => {

};
