import { CreateEventDetailRequestDto } from "../dtos/EventDetailDTO/CreateEventDetailDTO";
import { GetEventDetailResponseDto } from "../dtos/EventDetailDTO/GetEventDetailResponseDTO";
import { UpdateEventDetailRequestDto } from "../dtos/EventDetailDTO/UpdateEventDetailRequestDTO";
import { PrismaClient } from "../generated/prisma";
import { getValidEventFilter } from "../helpers/Helper";
import { getEndStartDateTyped } from "../utilities/EndStartDateHelper"

const prisma = new PrismaClient();

class EventDetailRepository {
    public static instance: EventDetailRepository;
    private constructor() { };

    public static getInstance() {
        if (!EventDetailRepository.instance) {
            EventDetailRepository.instance = new EventDetailRepository();
        }
        return EventDetailRepository.instance;
    }

    async getAllEventsDetails(skip: number, take: number, filterByAlcohol: boolean | null , filterByChildren: boolean | null) {
        const filter = getValidEventFilter(filterByAlcohol, filterByChildren);

        const data = await prisma.eventDetail.findMany({
            where: filter,
            skip: (skip - 1) * take,
            take: take,
            orderBy: { eventDate: 'asc' },
        });

        return {
            data,
            pages: Math.ceil(data.length / take),
            currentPage: skip
        }
    }

    async addEventDetail(createEventDetailDto: CreateEventDetailRequestDto, userId: string): Promise<GetEventDetailResponseDto> {
        const { eventDate, startTime, endTime } = createEventDetailDto;
        const { eventDateTyped, startDate, endDate } = getEndStartDateTyped(eventDate as string, startTime, endTime);

        return prisma.eventDetail.create({
            data: {
                ...createEventDetailDto,
                eventDate: eventDateTyped,
                startTime: startDate,
                endTime: endDate,
                userId,
            }
        })
    }

    async updateEventDetail(updateEventDetailDto: UpdateEventDetailRequestDto, id: number): Promise<GetEventDetailResponseDto> {
        const { eventDate, startTime, endTime } = updateEventDetailDto;
        const { eventDateTyped, startDate, endDate } = getEndStartDateTyped(eventDate as string, startTime, endTime);

        return prisma.eventDetail.update({
            where: { id },
            data: {
                ...updateEventDetailDto,
                eventDate: eventDateTyped,
                startTime: startDate,
                endTime: endDate
            }
        })
    }
}

export default EventDetailRepository;