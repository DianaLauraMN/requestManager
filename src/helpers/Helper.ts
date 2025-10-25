import { PaginationRequestDTO } from "../dtos/PaginationRequestDTO";


export const validatePaginationByReqQuery = (paginationRequestDto: PaginationRequestDTO): PaginationRequestDTO => {
    let defaultPage = 1;
    let defaultLimit = 5;

    if ((paginationRequestDto === null || paginationRequestDto === undefined) || (!paginationRequestDto.page && !paginationRequestDto.limit)) {
        paginationRequestDto = { page: defaultPage, limit: defaultLimit };
    } else if (paginationRequestDto.page && (!paginationRequestDto.limit)) {
        paginationRequestDto = { page: paginationRequestDto.page, limit: defaultLimit }
    } else if ((!paginationRequestDto.page) && paginationRequestDto.limit) {
        paginationRequestDto = { page: defaultPage, limit: paginationRequestDto.limit }
    }
    return paginationRequestDto;
}


