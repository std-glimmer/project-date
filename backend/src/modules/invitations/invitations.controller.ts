/**
 * InvitationsController — HTTP-слой управления приглашениями (админ)
 *
 * Все эндпоинты защищены JWT (глобальный guard).
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  /**
   * GET /api/invitations — список приглашений
   */
  @Get()
  findAll() {
    return this.invitationsService.findAll();
  }

  /**
   * GET /api/invitations/:id — детали приглашения
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationsService.findOne(id);
  }

  /**
   * POST /api/invitations — создать приглашение
   */
  @Post()
  create(@Body() dto: CreateInvitationDto) {
    return this.invitationsService.create(dto);
  }

  /**
   * PATCH /api/invitations/:id — обновить приглашение
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInvitationDto) {
    return this.invitationsService.update(id, dto);
  }

  /**
   * DELETE /api/invitations/:id — удалить приглашение
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitationsService.remove(id);
  }
}
