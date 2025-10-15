import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Candidate } from '../entities/candidate.entity';
import { JobOffer } from '../entities/job-offer.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { PaginationDto } from './dto/pagination.dto';
import { LegacyApiService } from '../legacy/legacy-api.service';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(JobOffer)
    private jobOfferRepository: Repository<JobOffer>,
    private legacyApiService: LegacyApiService,
  ) {}

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    const jobOffers = await this.jobOfferRepository.findBy({
      id: In(createCandidateDto.jobOfferIds),
    });
    
    if (jobOffers.length !== createCandidateDto.jobOfferIds.length) {
      throw new BadRequestException('One or more job offers not found');
    }

    if (jobOffers.length === 0) {
      throw new BadRequestException('At least one job offer is required');
    }

    const candidate = this.candidateRepository.create({
      ...createCandidateDto,
      consentDate: new Date(createCandidateDto.consentDate),
      jobOffers,
    });

    const savedCandidate = await this.candidateRepository.save(candidate);

    try {
      await this.legacyApiService.createCandidateInLegacySystem(createCandidateDto);
    } catch (error) {
      await this.candidateRepository.remove(savedCandidate);
      throw error;
    }

    return savedCandidate;
  }

  async findAll(paginationDto: PaginationDto): Promise<{ candidates: Candidate[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [candidates, total] = await this.candidateRepository.findAndCount({
      relations: ['jobOffers'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

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
      throw new NotFoundException(`Candidate with ID ${id} not found`);
    }

    return candidate;
  }

  async findByEmail(email: string): Promise<Candidate> {
    const candidate = await this.candidateRepository.findOne({
      where: { email },
      relations: ['jobOffers'],
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate with email ${email} not found`);
    }

    return candidate;
  }
}
