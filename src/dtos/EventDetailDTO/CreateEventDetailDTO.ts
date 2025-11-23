import { EventType, TableType } from "../../generated/prisma"

export interface CreateEventDetailRequestDto {
    guestsQuantity: number,
    eventType: EventType,
    eventName: string,
    eventDate: string,
    startTime?: string,
    endTime?: string,
    tableType?: TableType,
    children?: boolean,
    alcohol?: boolean,
}