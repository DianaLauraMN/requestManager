import RequestService from "../service/RequestService";
import { Request, Response } from "express";
import { ErrorStatus, SuccessStatus } from "../utilities/StatusCode";
import { ReqStatus } from "../entities/RequestEntity";
import { AppLogger } from "../utilities/Logger";
import { ErrorRequestMessage } from "../utilities/ErrorMessage";
import { getAppError } from "../utilities/Prisma/PrismaErrorValidator";

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
            let page: number = 1;
            let limit: number = 5;

            if (req.query.page && req.query.limit) {
                page = Number(req.query.page);
                limit = Number(req.query.limit);

                if (page <= 0) page = 1;
            }
            const response = await this.requestService.getAllRequests(page, limit);
            const { data } = response;

            this.appLogger.log(data.length > 0 ? `Getting ${data.length} requests` : "No requests founded", this.contextName, this.getAllRequests.name)
            res.status(SuccessStatus.SUCCESS_OK).json(response);

        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || '', appError?.code || 0, this.contextName, this.getAllRequests.name)
            res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.GETTING_ALL_REQUESTS })
        }
    }

    async getRequest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, this.contextName, this.getRequest.name)
                res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.INVALID_ID });
                return;
            }

            const request = await this.requestService.getRequest(id);

            if (!request) {
                this.appLogger.error(ErrorRequestMessage.GETTING_REQUEST_BY_ID, ErrorStatus.NOT_FOUND_ERROR, this.contextName, this.getRequest.name)
                res.status(ErrorStatus.NOT_FOUND_ERROR).json({ message: ErrorRequestMessage.INVALID_ID });
                return;
            }

            this.appLogger.log(`Request returned`, this.contextName, this.getRequest.name);
            res.status(SuccessStatus.SUCCESS_OK).json(request);

        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.getRequest.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE });
        }
    }

    async addRequest(req: Request, res: Response) {
        try {
            const requestData = req.body;
            const requestCreated = await this.requestService.addRequest(requestData);

            this.appLogger.log(`New Request added`, this.contextName, this.addRequest.name);
            res.status(SuccessStatus.CREATED).json(requestCreated);

        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.addRequest.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE })
        }
    }

    async updateRequest(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedReqData = req.body;

            if (!id) {
                this.appLogger.error(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, this.contextName, this.updateRequest.name);
                res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.UPDATING_REQUEST });
                return;
            }

            const requestUpdated = await this.requestService.updateRequest(updatedReqData, id);

            this.appLogger.log(`Request updated`, this.contextName, this.updateRequest.name);
            res.status(SuccessStatus.SUCCESS_OK).json(requestUpdated);

        } catch (error) {
            const appError = getAppError(error as Error);
            this.appLogger.error(appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE, appError?.code || ErrorStatus.UNCONTROLLED_ERROR, this.contextName, this.updateRequest.name);
            res.status(Number(appError?.code || ErrorStatus.UNCONTROLLED_ERROR)).json({ message: appError?.message || ErrorRequestMessage.GENERIC_ERROR_MESSAGE });
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { body: reqStatusData } = req;

            if (!id) {
                this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, this.contextName, this.updateStatus.name);
                res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.INVALID_ID });
                return;
            }
            if (!Object.values(ReqStatus).includes(reqStatusData.status)) {
                this.appLogger.error(ErrorRequestMessage.INVALID_STATUS, ErrorStatus.BAD_REQUEST_ERROR, this.contextName, this.updateRequest.name);
                res.status(ErrorStatus.BAD_REQUEST_ERROR).json({ message: ErrorRequestMessage.INVALID_STATUS });
                return;
            }

            const reqUpdated = await this.requestService.updateStatus(id, reqStatusData.status);
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