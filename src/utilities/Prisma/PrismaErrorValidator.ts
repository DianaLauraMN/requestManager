import { PrismaClientKnownRequestError } from "../../generated/prisma/runtime/library"
import { ErrorStatus } from "../StatusCode";

export class AppError extends Error {
    code: ErrorStatus;

    constructor(message: string, code: ErrorStatus) {
        super(message);
        this.message = message;
        this.code = code;
    }
}

export class ConflictError extends AppError {
    constructor(message: string, code: ErrorStatus) {
        super(message, code);
        this.message = message;
        this.code = code;
    }
}

const getAppError = (error: Error) => {
    if (error instanceof PrismaClientKnownRequestError) {
        const { code, meta } = error;
        switch (code) {
            case 'P2002':
                return new ConflictError(`Error, existing request with the same ${meta?.target}`, ErrorStatus.CONFLICT);
            case 'P2003':
                return new ConflictError(`Error, Foreign key constraint failed on the field: ${meta?.target}`, ErrorStatus.CONFLICT);
            case 'P2005':
                return new ConflictError(`The value ${meta?.value} stored in the database for the field ${meta?.target} is invalid for the field's type`, ErrorStatus.CONFLICT);
            default:
                return new AppError('Error, bad request', ErrorStatus.BAD_REQUEST_ERROR);
        }
    }
    return new AppError('Error, bad request', ErrorStatus.BAD_REQUEST_ERROR);
}

export { getAppError };