import { CreateEventDetailRequestDto } from "../dtos/EventDetailDTO/CreateEventDetailDTO";
import { PaginationEventFilterRequestDto } from "../dtos/EventDetailDTO/EventPaginationRequestDTO";
import { GetEventDetailResponseDto } from "../dtos/EventDetailDTO/GetEventDetailResponseDTO";
import { UpdateEventDetailRequestDto } from "../dtos/EventDetailDTO/UpdateEventDetailRequestDTO";
import EventDetailRepository from "../repository/EventDetailRepository";
import { ErrorRequestMessage } from "../utilities/ErrorMessage";
import { AppLogger } from "../utilities/Logger";
import { AppError } from "../utilities/Prisma/PrismaErrorValidator";
import { ErrorStatus } from "../utilities/StatusCode";

class EventDetailService {
    private eventDetailRepository: EventDetailRepository;
    private appLogger: AppLogger;

    constructor() {
        this.appLogger = new AppLogger();
        this.eventDetailRepository = EventDetailRepository.getInstance();
    }

    async getAllEventsDetials(paginationEventFilterByDto: PaginationEventFilterRequestDto) {
        const { alcohol, children, limit, page } = paginationEventFilterByDto;
        const allEvents = await this.eventDetailRepository.getAllEventsDetails(Number(page), Number(limit), alcohol as boolean, children as boolean);
        const { data } = allEvents;
        this.appLogger.log(data.length > 0 ? `Getting ${data.length} events` : "No events founded", EventDetailService.name, this.getAllEventsDetials.name);
        return allEvents;
    }

    async addEventDetail(createEventDetailDto: CreateEventDetailRequestDto, userId: string): Promise<GetEventDetailResponseDto> {
        if (!userId) {
            this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, EventDetailService.name, this.addEventDetail.name);
            throw new AppError(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR);
        }
        const eventDetail = await this.eventDetailRepository.addEventDetail(createEventDetailDto, userId);
        if (!eventDetail) {
            this.appLogger.error(ErrorRequestMessage.ADDING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, EventDetailService.name, this.getAllEventsDetials.name);
            throw new AppError(ErrorRequestMessage.ADDING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        this.appLogger.log(`Event of user with id ${userId} was added`, EventDetailService.name, this.addEventDetail.name);
        return eventDetail;
    }

    async updateEventDetail(updateEventDetailDto: UpdateEventDetailRequestDto, eventDetailId: number): Promise<GetEventDetailResponseDto> {
        if (!eventDetailId) {
            this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, EventDetailService.name, this.updateEventDetail.name);
            throw new AppError(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR);
        }
        const eventDetailUpdated = await this.eventDetailRepository.updateEventDetail(updateEventDetailDto, eventDetailId);
        if (!eventDetailUpdated) {
            this.appLogger.error(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, EventDetailService.name, this.updateEventDetail.name);
            throw new AppError(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        this.appLogger.log(`Event detail with id ${eventDetailId} was updated`, EventDetailService.name, this.updateEventDetail.name);
        return eventDetailUpdated;
    }

}

export default EventDetailService;