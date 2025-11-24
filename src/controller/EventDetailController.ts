import { Request, Response } from "express";
import EventDetailService from "../service/EventDetailService";
import { ErrorStatus, SuccessStatus } from "../utilities/StatusCode";
import { validateEventPaginationFilterBy } from "../helpers/Helper";
import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { GetEventDetailResponseDto } from "../dtos/EventDetailDTO/GetEventDetailResponseDTO";
import { getAppError } from "../utilities/Prisma/PrismaErrorValidator";
import { AppLogger } from "../utilities/Logger";
import { ErrorRequestMessage } from "../utilities/ErrorMessage";

class EventDetailController {
    private eventDetailService: EventDetailService;
    private appLogger: AppLogger;
    private contextName: string;

    constructor() {
        this.eventDetailService = new EventDetailService();
        this.appLogger = new AppLogger();
        this.contextName = EventDetailController.name;
    }

    async getAllEvents(req: Request, res: Response) {
        try {
            const paginationRequestDto = validateEventPaginationFilterBy(req.query);
            const allEventsResponse: PaginationResponse<GetEventDetailResponseDto> = await this.eventDetailService.getAllEventsDetials(paginationRequestDto);
            res.status(SuccessStatus.SUCCESS_OK).json(allEventsResponse);
        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.getAllEvents.name);
            res.status(Number(appError?.code) || ErrorStatus.UNCONTROLLED_ERROR).json({ message: ErrorRequestMessage.GETTING_ALL_REQUESTS });
        }
    }

    async addEventDetail(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const eventDetailDto = req.body;
            const eventDetailResponse = await this.eventDetailService.addEventDetail(eventDetailDto, id);
            res.status(SuccessStatus.SUCCESS_OK).json(eventDetailResponse);
        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.addEventDetail.name);
            res.status(Number(appError?.code) || ErrorStatus.UNCONTROLLED_ERROR).json({ message: ErrorRequestMessage.ADDING_REQUEST });
        }
    }

    async updateEventDetail(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const eventDetailUpdatedDto = req.body;
            const eventDetailUpdated = await this.eventDetailService.updateEventDetail(eventDetailUpdatedDto, Number(id));
            res.status(SuccessStatus.SUCCESS_OK).json(eventDetailUpdated);
        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.updateEventDetail.name);
            res.status(Number(appError?.code) || ErrorStatus.UNCONTROLLED_ERROR).json({ message: ErrorRequestMessage.UPDATING_REQUEST });
        }
    }

}

export default EventDetailController;