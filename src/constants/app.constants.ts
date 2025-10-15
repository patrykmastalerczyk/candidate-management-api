export const APP_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  MIN_EXPERIENCE: 0,
  MAX_EXPERIENCE: 50,
} as const;

export const ERROR_MESSAGES = {
  CANDIDATE_NOT_FOUND: 'Candidate not found',
  JOB_OFFERS_NOT_FOUND: 'One or more job offers not found',
  JOB_OFFERS_REQUIRED: 'At least one job offer is required',
  LEGACY_API_FAILED: 'Legacy API integration failed',
} as const;
