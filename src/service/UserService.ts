import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { PaginationRequestDTO, UserProfilePaginationDto, UserProfilePaginationOrderBy } from "../dtos/PaginationRequestDTO";
import { GetProfileResponseDto } from "../dtos/ProfileDto/GetProfileResponseDTO";
import { UpdateProfileRequestDto } from "../dtos/ProfileDto/UpdateProfileRequestDTO";
import { GetUserResponseDto } from "../dtos/UserDto/GetUserResponseDto";
import { UpdateUserRequestDto } from "../dtos/UserDto/UpdateUserRequestDTO";
import { PaginationUserFilterByDto, UserEventTypePaginationFilterBy, UserStatusPaginationFilterBy } from "../dtos/UserDto/UserPaginationRequestDTO";
import { UserRole, UserStatus } from "../generated/prisma";
import UserRepository from "../repository/UserRepository";
import { AppLogger } from "../utilities/Logger";
import * as bcrypt from 'bcrypt';

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

    async addUser(requestId: string, email: string, tel: string) {
        const { user, profile } = await this.userRepository.addUser({ email, tel, role: UserRole.CUSTOMER, fk_request_id: requestId, status: UserStatus.PENDING })
    }

    async updateUser(userUpdated: UpdateUserRequestDto, id: string) {
        const user = await this.userRepository.updateUser(userUpdated, id);
        return user;
    }

    async establishUserPassword(password: string, id: string) {
        if (!password || !id) {
            throw new Error('Error, invalid password');
        }
        const passwordHashed = await bcrypt.hash(password, 12);
        const userUpdated = await this.userRepository.establishUserPassword(passwordHashed, id);
        return userUpdated;
    }

    async getAllUsersProfiles(userProfilePaginationDto: UserProfilePaginationDto): Promise<PaginationResponse<GetProfileResponseDto>> {
        const allUserProfilesData = await this.userRepository.getAllUsersProfilesOrderedBy(Number(userProfilePaginationDto.page), Number(userProfilePaginationDto.limit), (userProfilePaginationDto.orderBy as UserProfilePaginationOrderBy))
        const { data } = allUserProfilesData;
        this.appLogger.log(data.length > 0 ? `Getting ${data.length} users` : "No users founded", UserService.name, this.getAllUsers.name);
        return allUserProfilesData;
    }

    async updateUserProfile(userProfileUpdated: UpdateProfileRequestDto, userId: string): Promise<GetProfileResponseDto> {
        const userProfile = await this.userRepository.updateUserProfile(userProfileUpdated, userId);
        return userProfile;
    }
}

export default UserService;