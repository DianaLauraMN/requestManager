import * as zod from "zod"
import { ReqStatus } from "../entities/RequestEntity"
import { NextFunction, Request, Response } from "express";
import { UpdateRequetsEntityRequestStatusDto } from "../dtos/UpdateRequestEntityReqStatusDTO";

const UpdateStatusRequestValidationSchema = zod.string().and(
    zod.enum(ReqStatus)
);

export const validadteUpdateStatusRequestEntityPipe = (req: Request, res: Response, next: NextFunction) => {
    const updateStatusRequestEntityDTO: UpdateRequetsEntityRequestStatusDto = req.body;
    try {
        UpdateStatusRequestValidationSchema.parse(updateStatusRequestEntityDTO.status);
    } catch (error) {
        if (error instanceof zod.ZodError) {
            res.status(400).json(error.issues);
            return;
        }
        res.status(400).json({ message: "Error, invalid status update. Validation Schema failed" });
    }
    next();
}
