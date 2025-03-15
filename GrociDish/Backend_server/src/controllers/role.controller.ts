import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';

const roleService = new RoleService();

export const assignRole = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId; // Requesting user's ID
    const { name, role } = req.body; // Target user's name and roles

    const updatedMember = await roleService.assignRole(userId, name, role);
    res.status(200).json({ message: 'Roles assigned successfully', updatedMember });
  } catch (error) {
    res.status(400).json({ message: "Error assigning role", error });
  }
};

export const getUserRole = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const role = await roleService.getUserRole(Number(userId));
        res.status(200).json({ role });
    } catch (error) {
        res.status(400).json({ message: "error getting user roles", error });
    }
  };
