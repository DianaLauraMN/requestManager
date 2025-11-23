import { UserRole, UserStatus } from "../../generated/prisma"

export interface CreateUserRequestDto {
    tel: string
    email: string
    password?: string
    status: UserStatus
    role: UserRole
    fk_request_id: string
}