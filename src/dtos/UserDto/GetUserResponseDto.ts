import { UserRole, UserStatus } from "../../generated/prisma"

export interface GetUserResponseDto {
    id: string
    email: string
    tel: string
    password: string | null
    status: UserStatus
    role: UserRole
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    requestId: string
}