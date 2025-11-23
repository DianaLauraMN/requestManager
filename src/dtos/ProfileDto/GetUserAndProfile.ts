import { GetUserResponseDto } from "../UserDto/GetUserResponseDto";
import { GetProfileResponseDto } from "./GetProfileResponseDTO";

export interface GetUserAndProfile extends Partial<GetUserResponseDto> {
    profile?: GetProfileResponseDto
};