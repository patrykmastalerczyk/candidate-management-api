import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidatesService } from './candidates.service';
import { Candidate } from '../entities/candidate.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { LegacyApiService } from '../legacy/legacy-api.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CandidateStatus } from '../entities/candidate.entity';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let candidateRepository: Repository<Candidate>;
  let jobOfferRepository: Repository<JobOffer>;
  let legacyApiService: LegacyApiService;

  const mockCandidateRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockJobOfferRepository = {
    findBy: jest.fn(),
  };

  const mockLegacyApiService = {
    createCandidateInLegacySystem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        {
          provide: getRepositoryToken(Candidate),
          useValue: mockCandidateRepository,
        },
        {
          provide: getRepositoryToken(JobOffer),
          useValue: mockJobOfferRepository,
        },
        {
          provide: LegacyApiService,
          useValue: mockLegacyApiService,
        },
      ],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
    candidateRepository = module.get<Repository<Candidate>>(getRepositoryToken(Candidate));
    jobOfferRepository = module.get<Repository<JobOffer>>(getRepositoryToken(JobOffer));
    legacyApiService = module.get<LegacyApiService>(LegacyApiService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCandidateDto: CreateCandidateDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      yearsOfExperience: 5,
      notes: 'Great candidate',
      consentDate: '2024-01-01T00:00:00.000Z',
      jobOfferIds: [1, 2],
    };

    const mockJobOffers: JobOffer[] = [
      { id: 1, title: 'Developer', description: 'Senior Developer', requirements: '5+ years', status: 'active' as any, createdAt: new Date(), updatedAt: new Date(), candidates: [] },
      { id: 2, title: 'Manager', description: 'Project Manager', requirements: '3+ years', status: 'active' as any, createdAt: new Date(), updatedAt: new Date(), candidates: [] },
    ];

    const mockCandidate: Candidate = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      yearsOfExperience: 5,
      notes: 'Great candidate',
      status: CandidateStatus.NEW,
      consentDate: new Date('2024-01-01T00:00:00.000Z'),
      createdAt: new Date(),
      updatedAt: new Date(),
      jobOffers: mockJobOffers,
    };

    it('should create a candidate successfully', async () => {
      mockJobOfferRepository.findBy.mockResolvedValue(mockJobOffers);
      mockCandidateRepository.create.mockReturnValue(mockCandidate);
      mockCandidateRepository.save.mockResolvedValue(mockCandidate);
      mockLegacyApiService.createCandidateInLegacySystem.mockResolvedValue(undefined);

      const result = await service.create(createCandidateDto);

      expect(mockJobOfferRepository.findBy).toHaveBeenCalledWith({
        id: expect.any(Object),
      });
      expect(mockCandidateRepository.create).toHaveBeenCalledWith({
        ...createCandidateDto,
        consentDate: new Date(createCandidateDto.consentDate),
        jobOffers: mockJobOffers,
      });
      expect(mockCandidateRepository.save).toHaveBeenCalledWith(mockCandidate);
      expect(mockLegacyApiService.createCandidateInLegacySystem).toHaveBeenCalledWith(createCandidateDto);
      expect(result).toEqual(mockCandidate);
    });

    it('should throw BadRequestException when job offers not found', async () => {
      mockJobOfferRepository.findBy.mockResolvedValue([mockJobOffers[0]]);

      await expect(service.create(createCandidateDto)).rejects.toThrow('One or more job offers not found');
    });

    it('should throw BadRequestException when no job offers provided', async () => {
      const dtoWithoutJobOffers = { ...createCandidateDto, jobOfferIds: [] };
      mockJobOfferRepository.findBy.mockResolvedValue([]);

      await expect(service.create(dtoWithoutJobOffers)).rejects.toThrow('At least one job offer is required');
    });

    it('should rollback candidate creation when legacy API fails', async () => {
      mockJobOfferRepository.findBy.mockResolvedValue(mockJobOffers);
      mockCandidateRepository.create.mockReturnValue(mockCandidate);
      mockCandidateRepository.save.mockResolvedValue(mockCandidate);
      mockLegacyApiService.createCandidateInLegacySystem.mockRejectedValue(new Error('Legacy API error'));

      await expect(service.create(createCandidateDto)).rejects.toThrow('Legacy API error');
      expect(mockCandidateRepository.remove).toHaveBeenCalledWith(mockCandidate);
    });
  });

  describe('findAll', () => {
    it('should return paginated candidates', async () => {
      const mockCandidates = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      ];
      const paginationDto = { page: 1, limit: 10 };

      mockCandidateRepository.findAndCount.mockResolvedValue([mockCandidates, 2]);

      const result = await service.findAll(paginationDto);

      expect(mockCandidateRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['jobOffers'],
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual({
        candidates: mockCandidates,
        total: 2,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a candidate by id', async () => {
      const mockCandidate = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' };
      mockCandidateRepository.findOne.mockResolvedValue(mockCandidate);

      const result = await service.findOne(1);

      expect(mockCandidateRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['jobOffers'],
      });
      expect(result).toEqual(mockCandidate);
    });

    it('should throw NotFoundException when candidate not found', async () => {
      mockCandidateRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Candidate not found with ID 999');
    });
  });
});
