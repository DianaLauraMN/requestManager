import { EventRequestStatus } from "../generated/prisma";

export interface GetRequestEntityResponseDto {
    id: string;
    email: string;
    tel: string;
    description: string;
    status: EventRequestStatus;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
