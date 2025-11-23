import { CreateRequestEntityRequestDto } from "../dtos/CreateRequestEntityRequestDTO";
import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { GetRequestEntityResponseDto } from "../dtos/GetRequestEntityResponseDTO";
import { PaginationRequestDTO } from "../dtos/PaginationRequestDTO";
import { UpdateRequetsEntityRequestStatusDto } from "../dtos/UpdateRequestEntityReqStatusDTO";
import { UpdateRequestEntityRequestDto } from "../dtos/UpdateRequestEntityRequestDTO";
import { ReqStatus } from "../entities/RequestEntity";
import RequestRepository from "../repository/RequestRepository";
import { ErrorRequestMessage } from "../utilities/ErrorMessage";
import { AppLogger } from "../utilities/Logger";
import { AppError } from "../utilities/Prisma/PrismaErrorValidator";
import { ErrorStatus } from "../utilities/StatusCode";
import UserService from "./UserService";

class RequestService {
    private requestRepository: RequestRepository = RequestRepository.getInstance();
    private userService: UserService;
    private appLogger: AppLogger;

    constructor() {
        this.appLogger = new AppLogger();
        this.userService = new UserService();

    }
    async getAllRequests(paginationDto: PaginationRequestDTO): Promise<PaginationResponse<GetRequestEntityResponseDto>> {
        const allRequestsResponse = await this.requestRepository.getAllRequests(Number(paginationDto.page), Number(paginationDto.limit));
        const { data } = allRequestsResponse;
        this.appLogger.log(data.length > 0 ? `Getting ${data.length} requests` : "No requests founded", RequestService.name, this.getAllRequests.name);
        return allRequestsResponse;
    }

    async getRequestById(id: string): Promise<GetRequestEntityResponseDto | null> {
        const requestById = await this.requestRepository.getRequest(id);
        if (!requestById) {
            this.appLogger.error(ErrorRequestMessage.GETTING_REQUEST_BY_ID, ErrorStatus.NOT_FOUND_ERROR, RequestService.name, this.getRequestById.name);
            throw new AppError(ErrorRequestMessage.GETTING_REQUEST_BY_ID, ErrorStatus.NOT_FOUND_ERROR);
        }
        this.appLogger.log('Request by Id returned', RequestService.name, this.getRequestById.name);
        return requestById
    }

    async addRequest(requestData: CreateRequestEntityRequestDto): Promise<GetRequestEntityResponseDto> {
        const newRequest = await this.requestRepository.addRequest(requestData);
        if (!newRequest) {
            this.appLogger.error(ErrorRequestMessage.ADDING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, RequestService.name, this.addRequest.name);
            throw new AppError(ErrorRequestMessage.ADDING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        this.appLogger.log(`New Request added`, RequestService.name, this.addRequest.name);
        return newRequest;
    }

    async updateRequest(updatedReqData: UpdateRequestEntityRequestDto, id: string): Promise<GetRequestEntityResponseDto> {
        if (!id) {
            this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, RequestService.name, this.updateRequest.name);
            throw new AppError(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR);
        }
        const updatedRequest = await this.requestRepository.updateRequest(updatedReqData, id);

        if (!updatedRequest) {
            this.appLogger.error(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, RequestService.name, this.updateRequest.name);
            throw new AppError(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        this.appLogger.log(`Request with id ${id} updated`, RequestService.name, this.updateRequest.name);
        return updatedRequest;
    }

    async updateStatus(id: string, statusData: UpdateRequetsEntityRequestStatusDto): Promise<GetRequestEntityResponseDto> {
        if (!id) {
            this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, RequestService.name, this.updateStatus.name);
            throw new AppError(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR);
        }
        if (!Object.values(ReqStatus).includes(statusData.status)) {
            this.appLogger.error(ErrorRequestMessage.INVALID_STATUS, ErrorStatus.BAD_REQUEST_ERROR, RequestService.name, this.updateStatus.name);
            throw new AppError(ErrorRequestMessage.INVALID_STATUS, ErrorStatus.BAD_REQUEST_ERROR);
        }

        const updatedStatus = await this.requestRepository.updateStatus(id, statusData.status);
        if (!updatedStatus) {
            this.appLogger.error(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, RequestService.name, this.updateStatus.name);
            throw new AppError(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        if (updatedStatus.status === 'ACCEPTED') {
            await this.userService.addUser(updatedStatus.id, updatedStatus.email, updatedStatus.tel);
        }
        this.appLogger.log(`Request status updated`, RequestService.name, this.updateStatus.name);
        return updatedStatus;
    }
}

export default RequestService;