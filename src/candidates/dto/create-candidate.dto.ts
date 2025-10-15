import { IsEmail, IsString, IsNumber, IsArray, IsDateString, IsOptional, Min, Max, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { APP_CONSTANTS } from '../../constants/app.constants';

export class CreateCandidateDto {
  @ApiProperty({ description: 'Candidate first name', example: 'Jan' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Candidate last name', example: 'Kowalski' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Candidate email address', example: 'jan.kowalski@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Candidate phone number', example: '+48123456789' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Years of professional experience', example: 5, minimum: 0, maximum: 50 })
  @IsNumber()
  @Min(APP_CONSTANTS.MIN_EXPERIENCE)
  @Max(APP_CONSTANTS.MAX_EXPERIENCE)
  yearsOfExperience: number;

  @ApiProperty({ description: 'Additional recruiter notes', example: 'Great candidate with strong technical skills', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Date of consent for recruitment', example: '2024-01-01T00:00:00.000Z' })
  @IsDateString()
  consentDate: string;

  @ApiProperty({ description: 'Array of job offer IDs', example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  jobOfferIds: number[];
}
