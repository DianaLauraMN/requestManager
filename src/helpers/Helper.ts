import { EventFilterBy, PaginationEventFilterRequestDto } from "../dtos/EventDetailDTO/EventPaginationRequestDTO";
import { UserProfilePaginationOrderBy, PaginationRequestDTO, UserProfilePaginationDto } from "../dtos/PaginationRequestDTO";
import { PaginationUserFilterByDto, UserEventTypePaginationFilterBy, UserStatusPaginationFilterBy } from "../dtos/UserDto/UserPaginationRequestDTO";


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

export const validateProfilePaginationOrderBy = (paginationUsersDto: UserProfilePaginationDto): UserProfilePaginationDto => {
    let orderBy = UserProfilePaginationOrderBy.EMAIL;

    if (paginationUsersDto?.orderBy && Object.values(UserProfilePaginationOrderBy).includes(paginationUsersDto?.orderBy)) {
        orderBy = paginationUsersDto.orderBy;
    }

    const paginationToValidate: PaginationRequestDTO = {
        page: paginationUsersDto?.page ? paginationUsersDto?.page : null as unknown as number,
        limit: paginationUsersDto?.limit ? paginationUsersDto.limit : null as unknown as number,
    }

    const paginationRequestDTO: PaginationRequestDTO = validatePaginationByReqQuery(paginationToValidate);

    const paginationUserDto: UserProfilePaginationDto = {
        limit: paginationRequestDTO?.limit as unknown as number,
        page: paginationRequestDTO?.page as unknown as number,
        orderBy
    }

    return paginationUserDto;
}

export const validateUserPaginationFilterBy = (paginationUserFilterByDto: PaginationUserFilterByDto): PaginationUserFilterByDto => {
    let statusDto = UserStatusPaginationFilterBy.ACTIVE;
    let eventTypeDto = UserEventTypePaginationFilterBy.ALL;

    const { eventType, status, limit, page } = paginationUserFilterByDto;

    const paginationToValidate: PaginationRequestDTO = { page: page ? page : null as unknown as number, limit: limit ? limit : null as unknown as number };
    const paginationValidated: PaginationRequestDTO = validatePaginationByReqQuery(paginationToValidate);

    if (status && Object.values(UserStatusPaginationFilterBy).includes(status)) {
        statusDto = status;
    }
    if (eventType && Object.values(UserEventTypePaginationFilterBy).includes(eventType)) {
        eventTypeDto = eventType;
    }

    return {
        status: statusDto,
        eventType: eventTypeDto,
        page: paginationValidated.page,
        limit: paginationValidated.limit,
    } as PaginationUserFilterByDto;

}

export const validateEventPaginationFilterBy = (paginationEventFilterByDto: PaginationEventFilterRequestDto): PaginationEventFilterRequestDto => {
    const { alcohol, children, limit, page } = paginationEventFilterByDto;
    let alcoholTyped: boolean | null = null;
    let childrenTyped: boolean | null = null;


    if (alcohol !== null && alcohol !== undefined) {
        alcoholTyped = stringToBoolean(alcohol);
    }
    if (children !== null && children !== undefined) {
        childrenTyped = stringToBoolean(children);
    }

    const paginationToValidate: PaginationRequestDTO = { page: page ? page : null as unknown as number, limit: limit ? limit : null as unknown as number };
    const paginationValidated: PaginationRequestDTO = validatePaginationByReqQuery(paginationToValidate);

    console.log(validateEventPaginationFilterBy.name);

    const eventPaginationFilterBy = {
        alcohol: alcoholTyped,
        children: childrenTyped,
        page: paginationValidated.page,
        limit: paginationValidated.limit,
    } as PaginationEventFilterRequestDto;

    console.log(eventPaginationFilterBy);
    return eventPaginationFilterBy;

};

export const getValidEventFilter = (filterByAlcohol: boolean | null, filterByChildren: boolean | null) => {
    let filter: EventFilterBy = {}

    if (filterByAlcohol !== null && filterByAlcohol !== undefined && filterByChildren !== null && filterByChildren !== undefined) {
        filter = {
            alcohol: filterByAlcohol,
            children: filterByChildren,
        };
    } else if (filterByAlcohol !== null && filterByChildren === null) {
        filter = {
            alcohol: filterByAlcohol,
        };

    } else if (filterByAlcohol === null && filterByChildren !== null) {
        filter = {
            children: filterByChildren,
        };
    }

    console.log("FILTERED ALCOHOL " + filter.alcohol);
    console.log("FILTERED CHILDREN " + filter.children);


    return filter;

}

const stringToBoolean = (value: any): boolean => {
    if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        if (lower === 'true') return true;
        if (lower === 'false') return false;
    }
    throw new Error(`Cannot convert "${value}" to boolean`);
}

