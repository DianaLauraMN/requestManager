import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { UserProfilePaginationDto, UserProfilePaginationOrderBy } from "../dtos/PaginationRequestDTO";
import { GetProfileResponseDto } from "../dtos/ProfileDto/GetProfileResponseDTO";
import { UpdateProfileRequestDto } from "../dtos/ProfileDto/UpdateProfileRequestDTO";
import { GetUserResponseDto } from "../dtos/UserDto/GetUserResponseDto";
import { UpdateUserRequestDto } from "../dtos/UserDto/UpdateUserRequestDTO";
import { PaginationUserFilterByDto, UserEventTypePaginationFilterBy, UserStatusPaginationFilterBy } from "../dtos/UserDto/UserPaginationRequestDTO";
import { UserRole, UserStatus } from "../generated/prisma";
import UserRepository from "../repository/UserRepository";
import { ErrorRequestMessage } from "../utilities/ErrorMessage";
import { AppLogger } from "../utilities/Logger";
import { AppError } from "../utilities/Prisma/PrismaErrorValidator";
import * as bcrypt from 'bcrypt';
import { ErrorStatus } from "../utilities/StatusCode";

class UserService {
    private userRepository: UserRepository = UserRepository.getInstance();
    private appLogger: AppLogger;

    constructor() {
        this.appLogger = new AppLogger();
    }

    async getAllUsers(paginationUserFilterByDto: PaginationUserFilterByDto): Promise<PaginationResponse<GetUserResponseDto>> {
        const userStatus = paginationUserFilterByDto.status ? paginationUserFilterByDto.status : UserStatusPaginationFilterBy.ACTIVE;
        const userEventType = paginationUserFilterByDto.eventType ? paginationUserFilterByDto.eventType : UserEventTypePaginationFilterBy.ALL;
        const allUsersData = await this.userRepository.getAllUsers(Number(paginationUserFilterByDto.page), Number(paginationUserFilterByDto.limit), userStatus, userEventType);
        const { data } = allUsersData;
        this.appLogger.log(data.length > 0 ? `Getting ${data.length} users` : "No users founded", UserService.name, this.getAllUsers.name);
        return allUsersData;
    }

    async getAllUsersProfiles(userProfilePaginationDto: UserProfilePaginationDto): Promise<PaginationResponse<GetProfileResponseDto>> {
        const allUserProfilesData = await this.userRepository.getAllUsersProfilesOrderedBy(Number(userProfilePaginationDto.page), Number(userProfilePaginationDto.limit), (userProfilePaginationDto.orderBy as UserProfilePaginationOrderBy))
        const { data } = allUserProfilesData;
        this.appLogger.log(data.length > 0 ? `Getting ${data.length} users with profile` : "No users with profile founded", UserService.name, this.getAllUsersProfiles.name);
        return allUserProfilesData;
    }

    async addUser(requestId: string, email: string, tel: string) {
        const { user, profile } = await this.userRepository.addUser({ email, tel, role: UserRole.CUSTOMER, fk_request_id: requestId, status: UserStatus.PENDING });
        if (!user || !profile) {
            this.appLogger.error(ErrorRequestMessage.ADDING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, UserService.name, this.addUser.name);
            throw new AppError(ErrorRequestMessage.ADDING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        this.appLogger.log('New User with profile added', UserService.name, this.addUser.name);
        return { user, profile };
    }

    async updateUser(userUpdated: UpdateUserRequestDto, userId: string) {
        if (!userId) {
            this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, UserService.name, this.updateUser.name);
            throw new AppError(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR);
        }
        const user = await this.userRepository.updateUser(userUpdated, userId);
        if (!user) {
            this.appLogger.error(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, UserService.name, this.updateUser.name);
            throw new AppError(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        this.appLogger.log(`User with id ${userId} updated`, UserService.name, this.updateUser.name);
        return user;
    }

    async updateUserProfile(userProfileUpdated: UpdateProfileRequestDto, userId: string): Promise<GetProfileResponseDto> {
        if (!userId) {
            this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, UserService.name, this.updateUserProfile.name);
            throw new AppError(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR);
        }
        const userProfile = await this.userRepository.updateUserProfile(userProfileUpdated, userId);
        if (!userProfile) {
            this.appLogger.error(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, UserService.name, this.updateUserProfile.name);
            throw new AppError(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        this.appLogger.log(`Profile of user with id ${userId} was updated`, UserService.name, this.updateUserProfile.name);
        return userProfile;
    }

    async establishUserPassword(password: string, userId: string) {
        if (!userId) {
            this.appLogger.error(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR, UserService.name, this.establishUserPassword.name);
            throw new AppError(ErrorRequestMessage.INVALID_ID, ErrorStatus.BAD_REQUEST_ERROR);
        }
        if (!password) {
            this.appLogger.error("INVALID PASSWORD", ErrorStatus.BAD_REQUEST_ERROR, UserService.name, this.establishUserPassword.name);
            throw new AppError("INVALID PASSWORD", ErrorStatus.BAD_REQUEST_ERROR);
        }
        const passwordHashed = await bcrypt.hash(password, 12);
        const userUpdated = await this.userRepository.establishUserPassword(passwordHashed, userId);

        if (!userUpdated) {
            this.appLogger.error(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR, UserService.name, this.establishUserPassword.name);
            throw new AppError(ErrorRequestMessage.UPDATING_REQUEST, ErrorStatus.BAD_REQUEST_ERROR);
        }
        this.appLogger.log(`Password of user with id ${userId} established`, UserService.name, this.establishUserPassword.name);
        return userUpdated;
    }

}

export default UserService;