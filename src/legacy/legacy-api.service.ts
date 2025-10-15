import { Injectable, Logger } from '@nestjs/common';
import { CreateCandidateDto } from '../candidates/dto/create-candidate.dto';

@Injectable()
export class LegacyApiService {
  private readonly logger = new Logger(LegacyApiService.name);

  async createCandidateInLegacySystem(candidateData: CreateCandidateDto): Promise<void> {
    try {
      this.logger.log(`Creating candidate in legacy system: ${candidateData.email}`);
      
      await this.simulateLegacyApiCall(candidateData);
      
      this.logger.log(`Successfully created candidate in legacy system: ${candidateData.email}`);
    } catch (error) {
      this.logger.error(`Failed to create candidate in legacy system: ${error.message}`);
      throw new Error(`Legacy API integration failed: ${error.message}`);
    }
  }

  private async simulateLegacyApiCall(candidateData: CreateCandidateDto): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (Math.random() < 0.05) {
      throw new Error('Legacy API temporarily unavailable');
    }
  }
}
