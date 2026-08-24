/**
 * Декоратор @Public()
 *
 * Помечает эндпоинты, которые не требуют JWT-авторизации.
 * Используется вместе с JwtAuthGuard.
 */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
