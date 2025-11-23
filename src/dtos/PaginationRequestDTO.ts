export enum UserProfilePaginationOrderBy {
    FIRSTNAME = "firstName",
    LASTNAME = "lastName",
    EMAIL = "email",
    TEL = "tel"
}

export interface PaginationRequestDTO {
    page?: number;
    limit?: number;
}

export type UserProfilePaginationDto = PaginationRequestDTO & {orderBy?: UserProfilePaginationOrderBy}

