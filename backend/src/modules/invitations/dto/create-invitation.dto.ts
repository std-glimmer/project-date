/**
 * DTO для создания приглашения
 */
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StepType } from '@prisma/client';

export class CreateStepDto {
  @IsEnum(StepType, { message: 'Тип шага должен быть DATE или PLACE' })
  type: StepType;

  @IsString()
  @IsNotEmpty({ message: 'Текст варианта обязателен' })
  label: string;

  @IsOptional()
  @IsString()
  emoji?: string;

  @IsOptional()
  order?: number;
}

export class CreateInvitationDto {
  @IsString()
  @IsNotEmpty({ message: 'Название обязательно' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Заголовок обязателен' })
  headline: string;

  @IsString()
  @IsNotEmpty({ message: 'Текст приветствия обязателен' })
  greetingText: string;

  @IsString()
  @IsUrl({}, { message: 'Некорректный URL GIF' })
  gifUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps: CreateStepDto[];
}
