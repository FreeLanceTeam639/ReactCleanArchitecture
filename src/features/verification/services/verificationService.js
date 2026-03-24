import { verificationEndpoints } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function normalizeTicket(ticket = {}) {
  return {
    id: pickFirst(ticket.id, ticket._id, ''),
    subject: pickFirst(ticket.subject, ''),
    message: pickFirst(ticket.message, ''),
    portfolioUrl: pickFirst(ticket.portfolioUrl, ''),
    status: String(pickFirst(ticket.status, 'Unverified')).toLowerCase(),
    createdAt: pickFirst(ticket.createdAt, ''),
    reviewedAt: pickFirst(ticket.reviewedAt, ''),
    adminNote: pickFirst(ticket.adminNote, '')
  };
}

function normalizeOverview(payload) {
  const entity = extractEntity(payload, ['data', 'overview', 'result']) || payload || {};

  return {
    isVerified: Boolean(pickFirst(entity.isVerified, false)),
    verificationStatus: String(pickFirst(entity.verificationStatus, 'Unverified')),
    canSubmitTicket: Boolean(pickFirst(entity.canSubmitTicket, true)),
    verificationNote: pickFirst(entity.verificationNote, ''),
    latestTicket: entity.latestTicket ? normalizeTicket(entity.latestTicket) : null
  };
}

export async function fetchVerificationOverview() {
  const payload = await httpClient.get(verificationEndpoints.me);
  return normalizeOverview(payload);
}

export async function submitVerificationTicket(payload) {
  const response = await httpClient.post(verificationEndpoints.tickets, payload);
  return normalizeOverview(response);
}
