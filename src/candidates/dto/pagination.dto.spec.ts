import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  let dto: PaginationDto;

  beforeEach(() => {
    dto = new PaginationDto();
  });

  it('should be valid with default values', async () => {
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
  });

  it('should be valid with custom values', async () => {
    dto.page = 2;
    dto.limit = 20;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid with page less than 1', async () => {
    dto.page = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('page');
  });

  it('should be invalid with limit less than 1', async () => {
    dto.limit = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('limit');
  });

  it('should be invalid with limit greater than 100', async () => {
    dto.limit = 101;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('limit');
  });

  it('should be valid with limit equal to 100', async () => {
    dto.limit = 100;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with page equal to 1', async () => {
    dto.page = 1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
