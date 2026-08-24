/**
 * Типы данных API
 */

// ============================================================
// Аутентификация
// ============================================================

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

// ============================================================
// Приглашения (админ)
// ============================================================

export type StepType = 'DATE' | 'PLACE';
export type InvitationStatus = 'ACTIVE' | 'ARCHIVED';

export interface InvitationStep {
  id: string;
  type: StepType;
  label: string;
  emoji?: string;
  order: number;
}

export interface InvitationListItem {
  id: string;
  title: string;
  status: InvitationStatus;
  views: number;
  answersCount: number;
  createdAt: string;
  updatedAt: string;
  token: string;
}

export interface InvitationDetail extends InvitationListItem {
  headline: string;
  greetingText: string;
  gifUrl: string;
  steps: InvitationStep[];
}

export interface CreateStepInput {
  type: StepType;
  label: string;
  emoji?: string;
  order?: number;
}

export interface CreateInvitationInput {
  title: string;
  headline: string;
  greetingText: string;
  gifUrl: string;
  steps: CreateStepInput[];
}

// ============================================================
// Публичное приглашение
// ============================================================

export interface PublicInvitation {
  id: string;
  headline: string;
  greetingText: string;
  gifUrl: string;
  dates: Array<{ id: string; label: string; emoji?: string }>;
  places: Array<{ id: string; label: string; emoji?: string }>;
}

export interface SubmitAnswerInput {
  dateStepId: string;
  placeStepId: string;
}

export interface SubmitAnswerResponse {
  success: boolean;
  answerId: string;
  message: string;
}

// ============================================================
// Аналитика
// ============================================================

export interface AnalyticsResponse {
  invitation: {
    id: string;
    title: string;
    status: InvitationStatus;
    views: number;
    createdAt: string;
  };
  summary: {
    totalViews: number;
    totalAnswers: number;
    conversionRate: number;
  };
  answers: Array<{
    id: string;
    date: string;
    place: string;
    answeredAt: string;
  }>;
  dateBreakdown: Array<{ id: string; label: string; count: number }>;
  placeBreakdown: Array<{ id: string; label: string; count: number }>;
}
