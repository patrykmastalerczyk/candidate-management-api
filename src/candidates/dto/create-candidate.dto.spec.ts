import { validate } from 'class-validator';
import { CreateCandidateDto } from './create-candidate.dto';

describe('CreateCandidateDto', () => {
  let dto: CreateCandidateDto;

  beforeEach(() => {
    dto = new CreateCandidateDto();
  });

  it('should be valid with correct data', async () => {
    dto.firstName = 'Jan';
    dto.lastName = 'Kowalski';
    dto.email = 'jan.kowalski@example.com';
    dto.phoneNumber = '+48123456789';
    dto.yearsOfExperience = 5;
    dto.notes = 'Great candidate';
    dto.consentDate = '2024-01-01T00:00:00.000Z';
    dto.jobOfferIds = [1, 2];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid with missing required fields', async () => {
    dto.firstName = 'Jan';
    dto.email = 'jan.kowalski@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should be invalid with invalid email', async () => {
    dto.firstName = 'Jan';
    dto.lastName = 'Kowalski';
    dto.email = 'invalid-email';
    dto.phoneNumber = '+48123456789';
    dto.yearsOfExperience = 5;
    dto.consentDate = '2024-01-01T00:00:00.000Z';
    dto.jobOfferIds = [1];

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should be invalid with negative years of experience', async () => {
    dto.firstName = 'Jan';
    dto.lastName = 'Kowalski';
    dto.email = 'jan.kowalski@example.com';
    dto.phoneNumber = '+48123456789';
    dto.yearsOfExperience = -1;
    dto.consentDate = '2024-01-01T00:00:00.000Z';
    dto.jobOfferIds = [1];

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('yearsOfExperience');
  });

  it('should be invalid with years of experience exceeding maximum', async () => {
    dto.firstName = 'Jan';
    dto.lastName = 'Kowalski';
    dto.email = 'jan.kowalski@example.com';
    dto.phoneNumber = '+48123456789';
    dto.yearsOfExperience = 51;
    dto.consentDate = '2024-01-01T00:00:00.000Z';
    dto.jobOfferIds = [1];

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('yearsOfExperience');
  });

  it('should be invalid with invalid date format', async () => {
    dto.firstName = 'Jan';
    dto.lastName = 'Kowalski';
    dto.email = 'jan.kowalski@example.com';
    dto.phoneNumber = '+48123456789';
    dto.yearsOfExperience = 5;
    dto.consentDate = 'invalid-date';
    dto.jobOfferIds = [1];

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('consentDate');
  });

  it('should be invalid with empty job offer IDs array', async () => {
    dto.firstName = 'Jan';
    dto.lastName = 'Kowalski';
    dto.email = 'jan.kowalski@example.com';
    dto.phoneNumber = '+48123456789';
    dto.yearsOfExperience = 5;
    dto.consentDate = '2024-01-01T00:00:00.000Z';
    dto.jobOfferIds = [];

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const jobOfferError = errors.find(error => error.property === 'jobOfferIds');
    expect(jobOfferError).toBeDefined();
  });

  it('should be valid without optional notes field', async () => {
    dto.firstName = 'Jan';
    dto.lastName = 'Kowalski';
    dto.email = 'jan.kowalski@example.com';
    dto.phoneNumber = '+48123456789';
    dto.yearsOfExperience = 5;
    dto.consentDate = '2024-01-01T00:00:00.000Z';
    dto.jobOfferIds = [1];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
