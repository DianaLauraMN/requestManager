import { Genders } from "../../generated/prisma";

export interface UpdateProfileRequestDto {
    firstName?: string;
    lastName?: string;
    country?: string;
    city?: string;
    gender?: Genders;
    age?: number;
}