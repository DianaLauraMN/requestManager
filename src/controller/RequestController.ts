import RequestService from "../service/RequestService";
import { Request, Response } from "express";
import { ErrorStatus, SuccessStatus } from "../utilities/StatusCode";
import { ReqStatus } from "../entities/RequestEntity";
import { AppLogger } from "../utilities/Logger";
import { ErrorRequestMessage } from "../utilities/ErrorMessage";
import { getAppError } from "../utilities/Prisma/PrismaErrorValidator";
import { PaginationRequestDTO } from "../dtos/PaginationRequestDTO"
import { CreateRequestEntityRequestDto } from "../dtos/CreateRequestEntityRequestDTO";
import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { GetRequestEntityResponseDto } from "../dtos/GetRequestEntityResponseDTO";
import { UpdateRequestEntityRequestDto } from "../dtos/UpdateRequestEntityRequestDTO";
import { UpdateRequetsEntityRequestStatusDto } from "../dtos/UpdateRequestEntityReqStatusDTO";

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
            let defaultPage = 1;
            let defaultLimit = 5;

            let paginationRequestDto: PaginationRequestDTO = req.query;
            if (!paginationRequestDto.page || !paginationRequestDto.limit) {
                paginationRequestDto = { page: defaultPage, limit: defaultLimit };
            }
            
            const allRequestsResponse: PaginationResponse<GetRequestEntityResponseDto> = await this.requestService.getAllRequests(paginationRequestDto);
            const { data } = allRequestsResponse;

            this.appLogger.log(data.length > 0 ? `Getting ${data.length} requests` : "No requests founded", this.contextName, this.getAllRequests.name)
            res.status(SuccessStatus.SUCCESS_OK).json(allRequestsResponse);

        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || '', appError?.code || 0, this.contextName, this.getAllRequests.name)
            res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.GETTING_ALL_REQUESTS })
        }
    }

    async getRequestById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            // if (!id) {
            //     this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, this.contextName, this.getRequestById.name)
            //     res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.INVALID_ID });
            //     return;
            // }

            const request = await this.requestService.getRequest(id);

            if (!request) {
                this.appLogger.error(ErrorRequestMessage.GETTING_REQUEST_BY_ID, ErrorStatus.NOT_FOUND_ERROR, this.contextName, this.getRequestById.name)
                res.status(ErrorStatus.NOT_FOUND_ERROR).json({ message: ErrorRequestMessage.INVALID_ID });
                return;
            }

            this.appLogger.log(`Request returned`, this.contextName, this.getRequestById.name);
            res.status(SuccessStatus.SUCCESS_OK).json(request);

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

            this.appLogger.log(`New Request added`, this.contextName, this.addRequest.name);
            res.status(SuccessStatus.CREATED).json(requestCreatedDto);

        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.addRequest.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE })
        }
    }

    async updateRequest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const requestToUpdateDto: UpdateRequestEntityRequestDto = req.body;

            if (!id) {
                this.appLogger.error(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, this.contextName, this.updateRequest.name);
                res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.UPDATING_REQUEST });
                return;
            }

            const requestUpdatedDto = await this.requestService.updateRequest(requestToUpdateDto, id);

            this.appLogger.log(`Request updated`, this.contextName, this.updateRequest.name);
            res.status(SuccessStatus.SUCCESS_OK).json(requestUpdatedDto);

        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.updateRequest.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const reqStatusDataDto: UpdateRequetsEntityRequestStatusDto = req.body;

            if (!id) {
                this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, this.contextName, this.updateStatus.name);
                res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.INVALID_ID });
                return;
            }
            if (!Object.values(ReqStatus).includes(reqStatusDataDto.status)) {
                this.appLogger.error(ErrorRequestMessage.INVALID_STATUS, ErrorStatus.BAD_REQUEST_ERROR, this.contextName, this.updateRequest.name);
                res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.INVALID_STATUS });
                return;
            }

            const reqUpdated: GetRequestEntityResponseDto = await this.requestService.updateStatus(id, reqStatusDataDto);
            this.appLogger.log(`Request status updtated`, this.contextName, this.updateStatus.name);
            res.status(SuccessStatus.SUCCESS_OK).json(reqUpdated);

        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.updateStatus.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE });
        }
    }
}

export default RequestController;