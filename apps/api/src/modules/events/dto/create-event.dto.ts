import { IsString, IsOptional, IsDateString, IsInt, Min } from 'class-validator';

export class CreateEventDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    registrationStartTime: string;

    @IsDateString()
    registrationEndTime: string;

    @IsDateString()
    eventStartTime: string;

    @IsDateString()
    eventEndTime: string;

    @IsInt()
    @Min(1)
    @IsOptional()
    maxTeams?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    minTeamSize?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    maxTeamSize?: number;

    @IsOptional()
    challenges: {
        type: 'CHAT' | 'SIMULATION';  // Match Prisma enum
        title: string;
        description: string;
        points: number;
        difficulty: string;
        systemPrompt?: string;      // Required for CHAT type
        flag: string;
        hint1?: string;
        hint2?: string;
        hint3?: string;
        hint1Penalty?: number;
        hint2Penalty?: number;
        hint3Penalty?: number;
        // Simulation-specific fields
        websiteTheme?: string;       // Required for SIMULATION type
        module1Name?: string;
        module1Content?: string;
        module2Name?: string;
        module2Content?: string;
        module3Name?: string;
        module3Content?: string;
        lockedModuleIndex?: number;  // 0=none, 1-3=locked module
        lockedModuleMsg?: string;
        chatbotPrompt?: string;      // For embedded chatbot in simulation
    }[];
}
