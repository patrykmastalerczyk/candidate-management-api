import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Candidate } from '../entities/candidate.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { PaginationDto } from './dto/pagination.dto';
import { LegacyApiService } from '../legacy/legacy-api.service';
import { CandidateResponse } from './interfaces/candidate-response.interface';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app.constants';

@Injectable()
export class CandidatesService {
  private readonly logger = new Logger(CandidatesService.name);

  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
    @InjectRepository(JobOffer)
    private readonly jobOfferRepository: Repository<JobOffer>,
    private readonly legacyApiService: LegacyApiService,
  ) {}

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    this.logger.log(`Creating candidate: ${createCandidateDto.email}`);
    
    const jobOffers = await this.validateJobOffers(createCandidateDto.jobOfferIds);
    
    const candidate = this.candidateRepository.create({
      ...createCandidateDto,
      consentDate: new Date(createCandidateDto.consentDate),
      jobOffers,
    });

    const savedCandidate = await this.candidateRepository.save(candidate);

    try {
      await this.legacyApiService.createCandidateInLegacySystem(createCandidateDto);
      this.logger.log(`Candidate created successfully: ${savedCandidate.id}`);
    } catch (error) {
      this.logger.error(`Legacy API failed, rolling back candidate: ${savedCandidate.id}`);
      await this.candidateRepository.remove(savedCandidate);
      throw error;
    }

    return savedCandidate;
  }

  private async validateJobOffers(jobOfferIds: number[]): Promise<JobOffer[]> {
    const jobOffers = await this.jobOfferRepository.findBy({
      id: In(jobOfferIds),
    });
    
    if (jobOffers.length !== jobOfferIds.length) {
      throw new BadRequestException(ERROR_MESSAGES.JOB_OFFERS_NOT_FOUND);
    }

    if (jobOffers.length === 0) {
      throw new BadRequestException(ERROR_MESSAGES.JOB_OFFERS_REQUIRED);
    }

    return jobOffers;
  }

  async findAll(paginationDto: PaginationDto): Promise<CandidateResponse> {
    const { page = APP_CONSTANTS.DEFAULT_PAGE, limit = APP_CONSTANTS.DEFAULT_LIMIT } = paginationDto;
    const skip = (page - 1) * limit;

    const [candidates, total] = await this.candidateRepository.findAndCount({
      relations: ['jobOffers'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Retrieved ${candidates.length} candidates (page ${page}/${Math.ceil(total / limit)})`);

    return {
      candidates,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({
      where: { id },
      relations: ['jobOffers'],
    });

    if (!candidate) {
      throw new NotFoundException(`${ERROR_MESSAGES.CANDIDATE_NOT_FOUND} with ID ${id}`);
    }

    return candidate;
  }

  async findByEmail(email: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({
      where: { email },
      relations: ['jobOffers'],
    });

    if (!candidate) {
      throw new NotFoundException(`${ERROR_MESSAGES.CANDIDATE_NOT_FOUND} with email ${email}`);
    }

    return candidate;
  }
}
