export interface PaginationResponse<T> {
    data: T[];
    pages: number;
    currentPage: number;
}