import { IsEmail, IsString, IsNumber, IsArray, IsDateString, IsOptional, Min, Max } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsNumber()
  @Min(0)
  @Max(50)
  yearsOfExperience: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  consentDate: string;

  @IsArray()
  @IsNumber({}, { each: true })
  jobOfferIds: number[];
}
