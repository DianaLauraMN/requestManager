import { CreateRequestEntityRequestDto } from "../dtos/CreateRequestEntityRequestDTO";
import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { GetRequestEntityResponseDto } from "../dtos/GetRequestEntityResponseDTO";
import { PaginationRequestDTO } from "../dtos/PaginationRequestDTO";
import { UpdateRequetsEntityRequestStatusDto } from "../dtos/UpdateRequestEntityReqStatusDTO";
import { UpdateRequestEntityRequestDto } from "../dtos/UpdateRequestEntityRequestDTO";
import RequestRepository from "../repository/RequestRepository";

class RequestService {
    private requestRepository: RequestRepository = RequestRepository.getInstance();
    async getAllRequests(paginationDto: PaginationRequestDTO): Promise<PaginationResponse<GetRequestEntityResponseDto>> {
        return this.requestRepository.getAllRequests(Number(paginationDto.page), Number(paginationDto.limit));
    }

    async getRequest(id: string): Promise<GetRequestEntityResponseDto | null> {
        return this.requestRepository.getRequest(id);
    }

    async addRequest(requestData: CreateRequestEntityRequestDto): Promise<GetRequestEntityResponseDto> {
        return this.requestRepository.addRequest(requestData);
    }

    async updateRequest(updatedReqData: UpdateRequestEntityRequestDto, id: string): Promise<GetRequestEntityResponseDto> {
        return this.requestRepository.updateRequest(updatedReqData, id);
    }

    async updateStatus(id: string, statusData: UpdateRequetsEntityRequestStatusDto): Promise<GetRequestEntityResponseDto> {
        return this.requestRepository.updateStatus(id, statusData.status);
    }
}

export default RequestService;