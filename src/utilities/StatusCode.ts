export enum ErrorStatus {
    UNCONTROLLED_ERROR = 0,
    BAD_REQUEST_ERROR = 400,
    NOT_FOUND_ERROR = 404,
    INTERNAL_SERVER_ERROR = 500,
    CONFLICT = 409,
}

export enum SuccessStatus {
    SUCCESS_OK = 200,
    CREATED = 201,
}
