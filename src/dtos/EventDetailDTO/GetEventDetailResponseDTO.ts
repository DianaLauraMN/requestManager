import { EventType, TableType } from "../../generated/prisma";

export interface GetEventDetailResponseDto {
    id: number,
    guestsQuantity: number,
    eventType: EventType,
    eventName: string,
    eventDate: Date,
    startTime: Date | null,
    endTime: Date | null,
    tableType: TableType | null,
    children: boolean | null,
    alcohol: boolean | null,
    userId: string,
}