import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Candidate, CandidateStatus } from '../entities/candidate.entity';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

  const mockCandidatesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: mockCandidatesService,
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a candidate', async () => {
      const createCandidateDto: CreateCandidateDto = {
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phoneNumber: '+48123456789',
        yearsOfExperience: 5,
        notes: 'Great candidate',
        consentDate: '2024-01-01T00:00:00.000Z',
        jobOfferIds: [1, 2],
      };

      const expectedCandidate: Candidate = {
        id: 1,
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phoneNumber: '+48123456789',
        yearsOfExperience: 5,
        notes: 'Great candidate',
        status: CandidateStatus.NEW,
        consentDate: new Date('2024-01-01T00:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
        jobOffers: [],
      };

      mockCandidatesService.create.mockResolvedValue(expectedCandidate);

      const result = await controller.create(createCandidateDto);

      expect(service.create).toHaveBeenCalledWith(createCandidateDto);
      expect(result).toEqual(expectedCandidate);
    });
  });

  describe('findAll', () => {
    it('should return paginated candidates', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const expectedResult = {
        candidates: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockCandidatesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith(paginationDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a candidate by id', async () => {
      const candidateId = 1;
      const expectedCandidate: Candidate = {
        id: 1,
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phoneNumber: '+48123456789',
        yearsOfExperience: 5,
        notes: 'Great candidate',
        status: CandidateStatus.NEW,
        consentDate: new Date('2024-01-01T00:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
        jobOffers: [],
      };

      mockCandidatesService.findOne.mockResolvedValue(expectedCandidate);

      const result = await controller.findOne(candidateId);

      expect(service.findOne).toHaveBeenCalledWith(candidateId);
      expect(result).toEqual(expectedCandidate);
    });
  });

  describe('findByEmail', () => {
    it('should return a candidate by email', async () => {
      const email = 'jan.kowalski@example.com';
      const expectedCandidate: Candidate = {
        id: 1,
        firstName: 'Jan',
        lastName: 'Kowalski',
        email: 'jan.kowalski@example.com',
        phoneNumber: '+48123456789',
        yearsOfExperience: 5,
        notes: 'Great candidate',
        status: CandidateStatus.NEW,
        consentDate: new Date('2024-01-01T00:00:00.000Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
        jobOffers: [],
      };

      mockCandidatesService.findByEmail.mockResolvedValue(expectedCandidate);

      const result = await controller.findByEmail(email);

      expect(service.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(expectedCandidate);
    });
  });
});
