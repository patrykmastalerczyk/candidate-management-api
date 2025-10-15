import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { PaginationDto } from './dto/pagination.dto';

@ApiTags('candidates')
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new candidate' })
  @ApiResponse({ status: 201, description: 'Candidate created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all candidates with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Candidates retrieved successfully' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.candidatesService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get candidate by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Candidate ID' })
  @ApiResponse({ status: 200, description: 'Candidate found' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.findOne(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get candidate by email' })
  @ApiParam({ name: 'email', type: String, description: 'Candidate email' })
  @ApiResponse({ status: 200, description: 'Candidate found' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  findByEmail(@Param('email') email: string) {
    return this.candidatesService.findByEmail(email);
  }
}
