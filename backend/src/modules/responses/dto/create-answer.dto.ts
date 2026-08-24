/**
 * DTO для отправки ответа на приглашение
 */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty({ message: 'Выберите дату' })
  dateStepId: string;

  @IsString()
  @IsNotEmpty({ message: 'Выберите место' })
  placeStepId: string;
}
