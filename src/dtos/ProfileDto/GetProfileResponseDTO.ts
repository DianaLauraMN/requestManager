import { Genders } from "../../generated/prisma";

export interface GetProfileResponseDto {
    id: number;
    firstName: string | null;
    lastName: string | null;
    country: string | null;
    city: string | null;
    gender: Genders | null;
    age: number | null;
    userId: string;
}