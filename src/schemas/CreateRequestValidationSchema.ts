import { NextFunction, Request, Response } from "express";
import * as zod from "zod"
import { CreateRequestEntityRequestDto } from "../dtos/CreateRequestEntityRequestDTO";

export const RequestEntityValidationSchema = zod.object({
    email: zod.email(),
    tel: zod.string(),
    description: zod.string(),
});


export const validateAddRequestEntityPipe = (req: Request, res: Response, next: NextFunction) => {
    const createRequestEntityDTO: CreateRequestEntityRequestDto = req.body;
    try {
        RequestEntityValidationSchema.parse(createRequestEntityDTO);
    } catch (error) {
        if (error instanceof zod.ZodError) {
            res.status(400).json(error.issues);
            return;
        }
        res.status(400).json({ message: "Error, invalid request. Validation Schema failed" });
    }
    next();
}