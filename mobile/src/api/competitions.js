import request from './client';

export const getCompetitionDetails = (id) => request(`/competitions/${id}`, { auth: true });

export const registerForCompetition = (id) => request(`/competitions/${id}/register`, { method: 'POST' });

export const confirmPayment = (id, paymentId) =>
  request(`/competitions/${id}/registration/confirm-payment`, { method: 'POST', body: { paymentId } });

export const submitEntry = (id, mediaUrl, caption) =>
  request(`/competitions/${id}/submissions`, { method: 'POST', body: { mediaUrl, caption } });
