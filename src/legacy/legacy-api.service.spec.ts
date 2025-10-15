import { Test, TestingModule } from '@nestjs/testing';
import { LegacyApiService } from './legacy-api.service';
import { CreateCandidateDto } from '../candidates/dto/create-candidate.dto';

describe('LegacyApiService', () => {
  let service: LegacyApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LegacyApiService],
    }).compile();

    service = module.get<LegacyApiService>(LegacyApiService);
    
    jest.spyOn(service['logger'], 'log').mockImplementation();
    jest.spyOn(service['logger'], 'error').mockImplementation();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCandidateInLegacySystem', () => {
    const candidateData: CreateCandidateDto = {
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan.kowalski@example.com',
      phoneNumber: '+48123456789',
      yearsOfExperience: 5,
      notes: 'Great candidate',
      consentDate: '2024-01-01T00:00:00.000Z',
      jobOfferIds: [1, 2],
    };

    it('should create candidate in legacy system successfully', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9);
      
      await expect(service.createCandidateInLegacySystem(candidateData)).resolves.toBeUndefined();
      
      expect(service['logger'].log).toHaveBeenCalledWith(
        expect.stringContaining('Creating candidate in legacy system: jan.kowalski@example.com')
      );
      expect(service['logger'].log).toHaveBeenCalledWith(
        expect.stringContaining('Successfully created candidate in legacy system: jan.kowalski@example.com')
      );
      
      jest.restoreAllMocks();
    });

    it('should handle legacy API failure', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.01);
      
      await expect(service.createCandidateInLegacySystem(candidateData)).rejects.toThrow(
        'Legacy API integration failed: Legacy API temporarily unavailable'
      );
      
      expect(service['logger'].error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to create candidate in legacy system: Legacy API temporarily unavailable'),
        expect.any(String)
      );
      
      jest.restoreAllMocks();
    });

    it('should simulate network delay', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.9);
      const startTime = Date.now();
      
      await service.createCandidateInLegacySystem(candidateData);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeGreaterThanOrEqual(100);
      jest.restoreAllMocks();
    });
  });
});
