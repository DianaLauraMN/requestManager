import { CreateRequestEntityRequestDto } from "../dtos/CreateRequestEntityRequestDTO";
import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { GetRequestEntityResponseDto } from "../dtos/GetRequestEntityResponseDTO";
import { UpdateRequestEntityRequestDto } from "../dtos/UpdateRequestEntityRequestDTO";
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

    async getAllRequests(skip: number, take: number): Promise<PaginationResponse<GetRequestEntityResponseDto>> {
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

    async getRequest(id: string): Promise<GetRequestEntityResponseDto | null> {
        return prisma.eventRequest.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                email: true,
                tel: true,
                description: true,
                status: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
            }
        })
    }

    async addRequest(request: CreateRequestEntityRequestDto): Promise<GetRequestEntityResponseDto> {
        return prisma.eventRequest.create({
            data: {
                email: request.email,
                tel: request.tel,
                description: request.description,
            }
        })
    }

    async updateRequest(updatedRequest: UpdateRequestEntityRequestDto, id: string): Promise<GetRequestEntityResponseDto> {
        return prisma.eventRequest.update({
            where: {
                id
            },
            data: {
                ...updatedRequest
            }
        })
    }

    async updateStatus(id: string, status: ReqStatus): Promise<GetRequestEntityResponseDto> {
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