import { PaginationRequestDTO } from "../PaginationRequestDTO";

export interface EventFilterBy {
    alcohol?: boolean | null, children?: boolean | null
}
export type PaginationEventFilterRequestDto = PaginationRequestDTO & EventFilterBy;