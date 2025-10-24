import { NextFunction, Request, Response } from "express";
import * as zod from "zod";

const PaginationValidationSchema = zod.object({
    page: zod.number().positive().default(1),
    limit: zod.number().positive().default(5)
})

export const validateRequestPaginationPipe = (req: Request, res: Response, next: NextFunction) => {
    try {
        let page = "1";
        let limit = "5";

        if (req.query.page && req.query.limit) {
            page = req.query.page as string;
            limit = req.query.limit as string;
        }
        if (isNaN(Number(page)) || isNaN(Number(limit))) {
            res.status(400).json({ message: "Error, invalid params. Wrong type" });
            return;
        }
        PaginationValidationSchema.parse({ page: Number(page), limit: Number(limit) });
    } catch (error) {
        if (error instanceof zod.ZodError) {
            res.status(400).json(error.issues);
            return;
        }
        res.status(400).json({ message: "Error, invalid params. Validation Schema failed" });
    }
    next();
}