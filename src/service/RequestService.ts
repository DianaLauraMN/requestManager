import { IRequest, ReqStatus } from "../entities/RequestEntity";
import RequestRepository from "../repository/RequestRepository";

class RequestService {
    private requestRepository: RequestRepository = RequestRepository.getInstance();

    async getAllRequests(skip: number, take: number) {
        return this.requestRepository.getAllRequests(skip, take);
    }

    async getRequest(id: string) {
        return await this.requestRepository.getRequest(id);
    }

    async addRequest(requestData: IRequest) {
        return await this.requestRepository.addRequest(requestData);
    }

    async updateRequest(updatedReqData: IRequest, id: string) {
        return await this.requestRepository.updateRequest(updatedReqData, id);
    }

    async updateStatus(id: string, reqStatus: ReqStatus) {
        return await this.requestRepository.updateStatus(id, reqStatus);
    }
}

export default RequestService;