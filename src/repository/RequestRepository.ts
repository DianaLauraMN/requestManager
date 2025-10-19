import { IRequest, ReqStatus } from "../entities/RequestEntity";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

class RequestRepository {

    public static instance: RequestRepository;

    private constructor() { };

    public static getInstance() {
        if (!RequestRepository.instance) {
            RequestRepository.instance = new RequestRepository();
        }
        return RequestRepository.instance;
    }

    async getTableCount() {
        return prisma.eventRequest.count({
            select: {
                _all: true
            }
        });
    }

    async getAllRequests(skip: number, take: number) {
        const { _all } = await this.getTableCount();
        const data = await prisma.eventRequest.findMany({
            skip: (skip - 1) * take,
            take: take
        });

        return {
            data,
            pages: Math.ceil(_all / take),
            currentPage: skip
        }
    }

    async getRequest(id: string) {
        return prisma.eventRequest.findUnique({
            where: {
                id
            }
        })
    }

    async addRequest(request: IRequest) {
        return prisma.eventRequest.create({
            data: {
                email: request.email,
                tel: request.tel,
                description: request.description,
            }
        })
    }

    async updateRequest(updatedRequest: IRequest, id: string) {
        return prisma.eventRequest.update({
            where: {
                id
            },
            data: {
                email: updatedRequest.email,
                tel: updatedRequest.tel,
                description: updatedRequest.description
            }
        })
    }

    async updateStatus(id: string, status: ReqStatus) {
        return prisma.eventRequest.update({
            where: {
                id
            },
            data: {
                status
            }
        })

    }

}


export default RequestRepository;