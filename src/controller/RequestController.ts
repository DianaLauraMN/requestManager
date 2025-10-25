import RequestService from "../service/RequestService";
import { Request, Response } from "express";
import { ErrorStatus, SuccessStatus } from "../utilities/StatusCode";
import { AppLogger } from "../utilities/Logger";
import { ErrorRequestMessage } from "../utilities/ErrorMessage";
import { getAppError } from "../utilities/Prisma/PrismaErrorValidator";
import { CreateRequestEntityRequestDto } from "../dtos/CreateRequestEntityRequestDTO";
import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { GetRequestEntityResponseDto } from "../dtos/GetRequestEntityResponseDTO";
import { UpdateRequestEntityRequestDto } from "../dtos/UpdateRequestEntityRequestDTO";
import { UpdateRequetsEntityRequestStatusDto } from "../dtos/UpdateRequestEntityReqStatusDTO";
import { validatePaginationByReqQuery } from "../helpers/Helper";

class RequestController {
    private requestService: RequestService;
    private appLogger: AppLogger;
    private contextName: string;

    constructor() {
        this.requestService = new RequestService();
        this.appLogger = new AppLogger();
        this.contextName = RequestController.name;
    }

    async getAllRequests(req: Request, res: Response) {
        try {
            const paginationRequestDto = validatePaginationByReqQuery(req.query);
            const allRequestsResponse: PaginationResponse<GetRequestEntityResponseDto> = await this.requestService.getAllRequests(paginationRequestDto);
            res.status(SuccessStatus.SUCCESS_OK).json(allRequestsResponse);
        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.getAllRequests.name)
            res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.GETTING_ALL_REQUESTS })
        }
    }

    async getRequestById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const requestById = await this.requestService.getRequestById(id);
            res.status(SuccessStatus.SUCCESS_OK).json(requestById);
        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.getRequestById.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE });
        }
    }

    async addRequest(req: Request, res: Response) {
        try {
            const requestData: CreateRequestEntityRequestDto = req.body;
            const requestCreatedDto: GetRequestEntityResponseDto = await this.requestService.addRequest(requestData);
            res.status(SuccessStatus.CREATED).json(requestCreatedDto);
        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.addRequest.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE })
        }
    }

    async updateRequest(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const requestToUpdateDto: UpdateRequestEntityRequestDto = req.body;
            const requestUpdatedDto = await this.requestService.updateRequest(requestToUpdateDto, id);
            res.status(SuccessStatus.SUCCESS_OK).json(requestUpdatedDto);
        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.updateRequest.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const reqStatusDataDto: UpdateRequetsEntityRequestStatusDto = req.body;
            const reqUpdated: GetRequestEntityResponseDto = await this.requestService.updateStatus(id, reqStatusDataDto);
            res.status(SuccessStatus.SUCCESS_OK).json(reqUpdated);
        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.updateStatus.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE });
        }
    }
}

export default RequestController;
