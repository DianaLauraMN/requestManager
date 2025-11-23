import { Request, Response } from "express";
import UserService from "../service/UserService";
import { AppLogger } from "../utilities/Logger";
import { validatePaginationByReqQuery, validateProfilePaginationOrderBy, validateUserPaginationFilterBy } from "../helpers/Helper";
import { PaginationResponse } from "../dtos/GetAllRequestsEntitiesResponseDTO";
import { GetUserResponseDto } from "../dtos/UserDto/GetUserResponseDto";
import { SuccessStatus } from "../utilities/StatusCode";
import { UpdateUserRequestDto } from "../dtos/UserDto/UpdateUserRequestDTO";
import { GetProfileResponseDto } from "../dtos/ProfileDto/GetProfileResponseDTO";
import { validateRequestPaginationPipe } from "../schemas/GetAllRequestEntityValidationSchema";
import { UpdateProfileRequestDto } from "../dtos/ProfileDto/UpdateProfileRequestDTO";
import { PaginationUserFilterByDto } from "../dtos/UserDto/UserPaginationRequestDTO";

class UserController {
    private userService: UserService;
    private appLogger: AppLogger;
    private contextName: string;

    constructor() {
        this.userService = new UserService();
        this.appLogger = new AppLogger();
        this.contextName = UserController.name;
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const paginationRequestDto = validateUserPaginationFilterBy(req.query);
            const allUsersResponse: PaginationResponse<GetUserResponseDto> = await this.userService.getAllUsers(paginationRequestDto);
            res.status(SuccessStatus.SUCCESS_OK).json(allUsersResponse);
        } catch (error) {
            console.log(error)
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const userToUpdateDto: UpdateUserRequestDto = req.body;
            const userUpdatedResponse = await this.userService.updateUser(userToUpdateDto, id);
            res.status(SuccessStatus.SUCCESS_OK).json(userUpdatedResponse);
        } catch (error) {
            console.log(error);

        }
    }

    async establishUserPassword(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string }
            const { password } = req.body;
            const userUpdated = await this.userService.establishUserPassword(password as string, id);
            res.status(SuccessStatus.SUCCESS_OK).json(userUpdated);
        } catch (error) {
            console.log(error);
        }
    }


    async getAllUsersProfiles(req: Request, res: Response) {
        try {
            const paginationUserProfileDto = validateProfilePaginationOrderBy(req.query);
            const allUserProfiles = await this.userService.getAllUsersProfiles(paginationUserProfileDto);
            res.status(SuccessStatus.SUCCESS_OK).json(allUserProfiles);
        } catch (error) {
            console.log(error);
        }
    }

    async updateUserProfile(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const profileToUpdateDto: UpdateProfileRequestDto = req.body;
            const userProfileUpdatedResponse = await this.userService.updateUserProfile(profileToUpdateDto, id);
            res.status(SuccessStatus.SUCCESS_OK).json(userProfileUpdatedResponse);
        } catch (error) {
            console.log(error);

        }
    }
}

export default UserController;