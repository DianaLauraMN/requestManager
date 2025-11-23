import { PaginationRequestDTO } from "../PaginationRequestDTO";

export enum UserStatusPaginationFilterBy {
    PENDING = "PENDING",
    ACTIVE = "ACTIVE"
}

export enum UserEventTypePaginationFilterBy {
    WEDDING = "WEDDING",
    XV = "XV",
    ANOTHER = "ANOTHER",
    ALL = "ALL",
}

export type PaginationUserFilterByDto = PaginationRequestDTO & { status?: UserStatusPaginationFilterBy, eventType?: UserEventTypePaginationFilterBy };