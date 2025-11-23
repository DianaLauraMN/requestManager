import { Request, Response } from "express";
import EventDetailService from "../service/EventDetailService";
import { SuccessStatus } from "../utilities/StatusCode";
import { validateEventPaginationFilterBy } from "../helpers/Helper";
import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { GetEventDetailResponseDto } from "../dtos/EventDetailDTO/GetEventDetailResponseDTO";

class EventDetailController {
    private eventDetailService: EventDetailService

    constructor() {
        this.eventDetailService = new EventDetailService();
    }

    async addEventDetail(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const eventDetailDto = req.body;
            const eventDetailResponse = await this.eventDetailService.addEventDetail(eventDetailDto, id);
            res.status(SuccessStatus.SUCCESS_OK).json(eventDetailResponse);
        } catch (error) {
            console.log(error);
        }
    }

    async updateEventDetail(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const eventDetailUpdatedDto = req.body;
            const eventDetailUpdated = await this.eventDetailService.updateEventDetail(eventDetailUpdatedDto, Number(id));
            res.status(SuccessStatus.SUCCESS_OK).json(eventDetailUpdated);
        } catch (error) {
            console.log(error);
        }
    }

    async getAllEvents(req: Request, res: Response) {
        try {
            const paginationRequestDto = validateEventPaginationFilterBy(req.query);
            const allEventsResponse:PaginationResponse<GetEventDetailResponseDto> = await this.eventDetailService.getAllEventsDetials(paginationRequestDto);
            res.status(SuccessStatus.SUCCESS_OK).json(allEventsResponse);
        } catch (error) {
            console.log(error);
        }
    }
}

export default EventDetailController;