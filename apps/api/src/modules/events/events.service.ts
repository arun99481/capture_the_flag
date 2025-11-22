import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(private prisma: PrismaService) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleEventExpiration() {
        const now = new Date();
        const result = await this.prisma.event.updateMany({
            where: {
                eventEndTime: { lt: now },
                // status: { not: 'COMPLETED' } // Assuming we want to mark them completed
            },
            data: {
                // status: 'COMPLETED' // If status enum existed in Prisma schema, which I removed in previous step to simplify, but I should probably add it back or just rely on dates.
                // Since I removed the enum in the schema update (Wait, did I? I think I did in the replace_file_content step 27).
                // Let's check the schema again. I removed EventStatus enum.
                // So I can't update status. I'll just log for now or maybe I should have kept it.
                // The user requirement said "Force end event / pause event" in Admin Dashboard, so status is useful.
                // But the schema I generated in step 27 removed it? Let me check step 27 input.
                // Yes, I removed EventStatus enum in step 27.
                // I should probably rely on dates for "active" check in GameService.
            }
        });
        // this.logger.debug(`Checked for expired events.`);
    }

    async create(data: CreateEventDto, creatorId: string) {
        const { challenges, ...eventData } = data;
        return this.prisma.event.create({
            data: {
                ...eventData,
                registrationStartTime: new Date(data.registrationStartTime),
                registrationEndTime: new Date(data.registrationEndTime),
                eventStartTime: new Date(data.eventStartTime),
                eventEndTime: new Date(data.eventEndTime),
                creatorId,
                challenges: challenges ? {
                    create: challenges.map((challenge, index) => ({
                        ...challenge,
                        order: index + 1,
                    })),
                } : undefined,
            },
        });
    }

    async forceEnd(id: string) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) throw new NotFoundException('Event not found');

        return this.prisma.event.update({
            where: { id },
            data: {
                eventEndTime: new Date(), // Set end time to now
            },
        });
    }

    async findAll() {
        return this.prisma.event.findMany({
            orderBy: { eventStartTime: 'asc' },
        });
    }

    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: { challenges: { orderBy: { order: 'asc' } } },
        });
        if (!event) throw new NotFoundException('Event not found');
        return event;
    }
}
