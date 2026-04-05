const API_BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (res.status === 401) {
    // Could redirect to login, but let caller handle
    const data = await res.json().catch(() => ({ error: 'Unauthorized' }))
    throw new Error(data.error || 'Unauthorized')
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(data.error || `Request failed: ${res.status}`)
  }

  return res.json()
}

// Auth
export const auth = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signup: (data) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (email, code, newPassword) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, code, newPassword }) }),
}

// Providers
export const providers = {
  list: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '')).toString()
    return request(`/providers${qs ? '?' + qs : ''}`)
  },
  get: (id) => request(`/providers/${id}`),
  toggleAvailability: (id) => request(`/providers/${id}/availability`, { method: 'PUT' }),
  update: (id, data) => request(`/providers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  addService: (id, data) => request(`/providers/${id}/services`, { method: 'POST', body: JSON.stringify(data) }),
  removeService: (id, sid) => request(`/providers/${id}/services/${sid}`, { method: 'DELETE' }),
  addBlog: (id, data) => request(`/providers/${id}/blog`, { method: 'POST', body: JSON.stringify(data) }),
  addPortfolio: (id, data) => request(`/providers/${id}/portfolio`, { method: 'POST', body: JSON.stringify(data) }),
  dashboard: () => request('/providers/me/dashboard'),
}

// Users
export const users = {
  profile: () => request('/users/me/profile'),
  update: (data) => request('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  favorites: () => request('/users/me/favorites'),
  addFavorite: (providerId) => request(`/users/me/favorites/${providerId}`, { method: 'POST' }),
  removeFavorite: (providerId) => request(`/users/me/favorites/${providerId}`, { method: 'DELETE' }),
  bookings: () => request('/users/me/bookings'),
}

// Bookings
export const bookings = {
  create: (data) => request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/bookings${qs ? '?' + qs : ''}`)
  },
  updateStatus: (id, status) => request(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  availability: (providerId, from, to) => request(`/bookings/providers/${providerId}/availability?from=${from}&to=${to}`),
}

// Messages
export const messages = {
  conversations: () => request('/messages/conversations'),
  withProvider: (providerId) => request(`/messages/conversations/with/${providerId}`),
  send: (conversationId, text) => request(`/messages/conversations/${conversationId}/messages`, { method: 'POST', body: JSON.stringify({ text }) }),
}

// Notifications
export const notifications = {
  list: () => request('/notifications'),
  unreadCount: () => request('/notifications/unread-count'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  getPreferences: () => request('/notifications/preferences'),
  updatePreferences: (prefs) => request('/notifications/preferences', { method: 'PUT', body: JSON.stringify(prefs) }),
}

// Search
export const search = {
  autocomplete: (q) => request(`/search/autocomplete?q=${encodeURIComponent(q)}`),
  savedList: () => request('/search/saved'),
  save: (data) => request('/search/saved', { method: 'POST', body: JSON.stringify(data) }),
  deleteSaved: (id) => request(`/search/saved/${id}`, { method: 'DELETE' }),
  reminders: () => request('/search/reminders'),
  createReminder: (data) => request('/search/reminders', { method: 'POST', body: JSON.stringify(data) }),
  updateReminder: (id, data) => request(`/search/reminders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
}

// Support
export const support = {
  create: (data) => request('/support', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request('/support'),
  get: (id) => request(`/support/${id}`),
}

// Policy Upload & Review
export const policies = {
  upload: (formData) => fetch('/api/policies/upload', { method: 'POST', credentials: 'include', body: formData }).then(r => r.json()),
  mine: () => request('/policies/mine'),
  pending: () => request('/policies/pending'),
  get: (id) => request(`/policies/${id}`),
  review: (id, data) => request(`/policies/${id}/review`, { method: 'PATCH', body: JSON.stringify(data) }),
}

// Module 29: QADE Appointments
export const qadeAppointments = {
  submitLead: (data) => request('/appointments/leads', { method: 'POST', body: JSON.stringify(data) }),
  listLeads: (params = {}) => { const qs = new URLSearchParams(params).toString(); return request(`/appointments/leads${qs ? '?' + qs : ''}`) },
  getLead: (id) => request(`/appointments/leads/${id}`),
  match: (id) => request(`/appointments/${id}/match`, { method: 'POST' }),
  dispatch: (id) => request(`/appointments/${id}/dispatch`, { method: 'POST' }),
  respond: (id, action) => request(`/appointments/${id}/respond`, { method: 'POST', body: JSON.stringify({ action }) }),
  offered: () => request('/appointments/offered'),
  mine: () => request('/appointments/mine'),
  providerQueue: () => request('/appointments/provider-queue'),
  get: (id) => request(`/appointments/${id}`),
  schedule: (id, data) => request(`/appointments/${id}/schedule`, { method: 'POST', body: JSON.stringify(data) }),
  start: (id) => request(`/appointments/${id}/start`, { method: 'POST' }),
  complete: (id) => request(`/appointments/${id}/complete`, { method: 'POST' }),
  noShow: (id) => request(`/appointments/${id}/no-show`, { method: 'POST' }),
  cancel: (id, reason) => request(`/appointments/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  outcome: (id, data) => request(`/appointments/${id}/outcome`, { method: 'POST', body: JSON.stringify(data) }),
  survey: (id, data) => request(`/appointments/${id}/survey`, { method: 'POST', body: JSON.stringify(data) }),
  analyticsSummary: () => request('/appointments/analytics/summary'),
}

// Provider Config (Module 29)
export const providerConfig = {
  licensing: () => request('/provider-config/licensing'),
  addLicense: (data) => request('/provider-config/licensing', { method: 'POST', body: JSON.stringify(data) }),
  updateLicense: (id, data) => request(`/provider-config/licensing/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLicense: (id) => request(`/provider-config/licensing/${id}`, { method: 'DELETE' }),
  capacity: () => request('/provider-config/capacity'),
  updateCapacity: (data) => request('/provider-config/capacity', { method: 'PUT', body: JSON.stringify(data) }),
  territories: () => request('/provider-config/territories'),
  claimTerritory: (data) => request('/provider-config/territories', { method: 'POST', body: JSON.stringify(data) }),
}

// Compliance (Module 29)
export const compliance = {
  auditLog: (params = {}) => { const qs = new URLSearchParams(params).toString(); return request(`/compliance/audit-log${qs ? '?' + qs : ''}`) },
  consent: (leadId) => request(`/compliance/consent/${leadId}`),
  dataRequest: (email) => request('/compliance/data-request', { method: 'POST', body: JSON.stringify({ email }) }),
  dataDelete: (email) => request('/compliance/data-delete', { method: 'POST', body: JSON.stringify({ email }) }),
}

// Admin
export const admin = {
  stats: () => request('/admin/stats'),
  users: (params = {}) => { const qs = new URLSearchParams(params).toString(); return request(`/admin/users${qs ? '?' + qs : ''}`) },
  updateUser: (id, data) => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  providers: (params = {}) => { const qs = new URLSearchParams(params).toString(); return request(`/admin/providers${qs ? '?' + qs : ''}`) },
  verifyProvider: (id) => request(`/admin/providers/${id}/verify`, { method: 'PATCH' }),
  tickets: () => request('/admin/tickets'),
  updateTicket: (id, data) => request(`/admin/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
}

// Payments
export const payments = {
  create: (data) => request('/payments', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request('/payments'),
  get: (id) => request(`/payments/${id}`),
}

// Deals
export const deals = {
  list: (limit) => request(`/deals${limit ? '?limit=' + limit : ''}`),
  create: (data) => request('/deals', { method: 'POST', body: JSON.stringify(data) }),
  claim: (id) => request(`/deals/${id}/claim`, { method: 'POST' }),
}

// Reviews
export const reviews = {
  create: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  list: (providerId) => request(`/reviews${providerId ? '?providerId=' + providerId : ''}`),
  respond: (id, text) => request(`/reviews/${id}/response`, { method: 'PUT', body: JSON.stringify({ text }) }),
}

// Rewards
export const rewards = {
  get: () => request('/rewards'),
  redeem: (points, action) => request('/rewards/redeem', { method: 'POST', body: JSON.stringify({ points, action }) }),
}

// Referrals
export const referrals = {
  get: () => request('/referrals'),
}

// Analytics
export const analytics = {
  provider: () => request('/analytics/provider'),
  platform: () => request('/analytics/platform'),
}
