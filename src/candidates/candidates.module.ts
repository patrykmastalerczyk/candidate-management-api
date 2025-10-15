import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { Candidate } from '../entities/candidate.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { LegacyApiService } from '../legacy/legacy-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, JobOffer])],
  controllers: [CandidatesController],
  providers: [CandidatesService, LegacyApiService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
