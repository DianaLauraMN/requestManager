import { NextFunction, Request, Response } from "express";
import * as zod from "zod";

const IdValidationSchema = zod.string().and(
    zod.uuid()
)

export const validateGetRequestEntityPipe = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            res.status(400).json({ message: "Error, Id is mandatory" });
        }
        IdValidationSchema.parse(req.params.id);
    } catch (error) {
        if (error instanceof zod.ZodError) {
            res.status(400).json(error.issues);
            return;
        }
        res.status(400).json({ message: "Error, invalid Id. Validation Schema failed" });
    }
    next();
}