/**
 * ResponsesController — публичные эндпоинты для получателя приглашения
 *
 * Эти эндпоинты доступны без авторизации (@Public()).
 */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { Public } from '../../common/decorators/public.decorator';

@Controller('invite')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  /**
   * GET /api/invite/:token — получить приглашение по токену
   */
  @Public()
  @Get(':token')
  getInvitation(@Param('token') token: string) {
    return this.responsesService.getInvitationByToken(token);
  }

  /**
   * POST /api/invite/:token/answer — отправить ответ
   */
  @Public()
  @Post(':token/answer')
  submitAnswer(@Param('token') token: string, @Body() dto: CreateAnswerDto) {
    return this.responsesService.submitAnswer(token, dto);
  }
}
