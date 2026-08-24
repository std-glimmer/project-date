/**
 * DTO для обновления приглашения
 *
 * Все поля опциональны — обновляются только переданные.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateInvitationDto } from './create-invitation.dto';

export class UpdateInvitationDto extends PartialType(CreateInvitationDto) {}
