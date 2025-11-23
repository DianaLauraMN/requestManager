import { CreateUserRequestDto } from "./CreateUserRequestDTO";

export interface UpdateUserRequestDto extends Partial<CreateUserRequestDto> { };