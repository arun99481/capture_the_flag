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
        title: string;
        description: string;
        points: number;
        difficulty: string;
        systemPrompt: string;
        flag: string;
        hint1?: string;
        hint2?: string;
        hint3?: string;
        hint1Penalty?: number;
        hint2Penalty?: number;
        hint3Penalty?: number;
    }[];
}
