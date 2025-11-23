import { CreateEventDetailRequestDto } from "../dtos/EventDetailDTO/CreateEventDetailDTO";
import { PaginationEventFilterRequestDto } from "../dtos/EventDetailDTO/EventPaginationRequestDTO";
import { GetEventDetailResponseDto } from "../dtos/EventDetailDTO/GetEventDetailResponseDTO";
import { UpdateEventDetailRequestDto } from "../dtos/EventDetailDTO/UpdateEventDetailRequestDTO";
import EventDetailRepository from "../repository/EventDetailRepository";
import { AppLogger } from "../utilities/Logger";

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
        const eventDetail = await this.eventDetailRepository.addEventDetail(createEventDetailDto, userId);
        return eventDetail;
    }

    async updateEventDetail(updateEventDetailDto: UpdateEventDetailRequestDto, eventDetailId: number): Promise<GetEventDetailResponseDto> {
        const eventDetailUpdated = await this.eventDetailRepository.updateEventDetail(updateEventDetailDto, eventDetailId);
        return eventDetailUpdated;
    }

}

export default EventDetailService;