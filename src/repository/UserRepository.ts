import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { UserProfilePaginationOrderBy } from "../dtos/PaginationRequestDTO";
import { GetProfileResponseDto } from "../dtos/ProfileDto/GetProfileResponseDTO";
import { UpdateProfileRequestDto } from "../dtos/ProfileDto/UpdateProfileRequestDTO";
import { CreateUserRequestDto } from "../dtos/UserDto/CreateUserRequestDTO";
import { GetUserResponseDto } from "../dtos/UserDto/GetUserResponseDto";
import { GetUsersResponseDto } from "../dtos/UserDto/GetUsersResponseDto";
import { UpdateUserRequestDto } from "../dtos/UserDto/UpdateUserRequestDTO";
import { UserEventTypePaginationFilterBy, UserStatusPaginationFilterBy } from "../dtos/UserDto/UserPaginationRequestDTO";
import { PrismaClient, UserStatus } from "../generated/prisma";

const prisma = new PrismaClient();

class UserRepository {

    public static instance: UserRepository;

    private constructor() { };

    public static getInstance() {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    async getAllUsers(skip: number, take: number, status: UserStatusPaginationFilterBy, eventType: UserEventTypePaginationFilterBy): Promise<PaginationResponse<GetUserResponseDto>> {
        let filter: Object = {
            status
        };
        if (eventType !== UserEventTypePaginationFilterBy.ALL) {
            filter = {
                status,
                eventDetails: {
                    eventType,
                }
            }
        }

        const data = await prisma.user.findMany({
            include: {
                eventDetails: true,
            },
            where: filter,
            skip: (skip - 1) * take,
            take: take,
            orderBy: { createdAt: 'asc' },
        });
        return {
            data,
            pages: Math.ceil(data.length / take),
            currentPage: skip
        }
    }

    async addUser(userDto: CreateUserRequestDto): Promise<{ user: GetUserResponseDto, profile: GetProfileResponseDto }> {
        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.create({
                data: {
                    email: userDto.email,
                    role: userDto.role,
                    tel: userDto.tel,
                    requestId: userDto.fk_request_id,
                }
            });

            const profile = await tx.profile.create({
                data: {
                    userId: user.id,
                }
            });


            return { user, profile }
        })
        return result;
    }

    async updateUser(userUpdated: UpdateUserRequestDto, id: string): Promise<GetUsersResponseDto> {
        return prisma.user.update({
            where: { id },
            data: {
                ...userUpdated
            }
        })
    }

    async establishUserPassword(password: string, id: string) {
        return prisma.user.update({
            where: { id },
            data: {
                password,
                status: UserStatus.ACTIVE
            }
        })
    }

    async getAllUsersProfilesOrderedBy(skip: number, take: number, userOrderBy: UserProfilePaginationOrderBy): Promise<PaginationResponse<any>> { //GetUserAndProfile
        let orderByProfile;

        if (userOrderBy === UserProfilePaginationOrderBy.FIRSTNAME || userOrderBy === UserProfilePaginationOrderBy.LASTNAME) {
            orderByProfile = {
                profile: {
                    [userOrderBy]: 'asc'
                }
            }
        }

        const data = await prisma.user.findMany({
            include: {
                profile: true
            },
            orderBy: orderByProfile ? orderByProfile : { [userOrderBy]: 'asc' }
        });
        return {
            data,
            pages: Math.ceil(data.length / take),
            currentPage: skip
        }
    }

    async updateUserProfile(userProfile: UpdateProfileRequestDto, userId: string): Promise<GetProfileResponseDto> {
        return prisma.profile.update({
            where: {
                userId
            },
            data: {
                ...userProfile
            }
        })
    }

    async getUserByID(id: string): Promise<GetUserResponseDto> {
        const user = await prisma.user.findFirst({
            where: { id }
        })

        return user as GetUserResponseDto;
    }
}

export default UserRepository;