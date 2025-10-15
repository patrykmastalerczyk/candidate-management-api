import { Candidate } from '../../entities/candidate.entity';

export interface CandidateResponse {
  candidates: Candidate[];
  total: number;
  page: number;
  limit: number;
}
