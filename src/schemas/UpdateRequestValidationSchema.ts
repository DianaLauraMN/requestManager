import { NextFunction, Request, Response } from "express";
import * as zod from "zod";
import { UpdateRequestEntityRequestDto } from "../dtos/UpdateRequestEntityRequestDTO";
import { RequestEntityValidationSchema } from "./CreateRequestValidationSchema";

const UpdateEntityValidationSchema = RequestEntityValidationSchema.partial().refine(
    (data) => {
        if (Object.keys(data).length < 1 || Object.keys(data).length > 3) {
            throw new Error('Error, invalid fields requried');
        }
        return true;
    }
)

export const validateUpdateRequestEntityPipe = (req: Request, res: Response, next: NextFunction) => {
    const updateRequestEntityDTO: UpdateRequestEntityRequestDto = req.body;
    try {
        UpdateEntityValidationSchema.parse(updateRequestEntityDTO);
    } catch (error) {
        if (error instanceof zod.ZodError) {
            res.status(400).json(error.issues);
            return;
        }
        res.status(400).json({ message: "Error, invalid update. Validation Schema failed" })
    }
    next();
}