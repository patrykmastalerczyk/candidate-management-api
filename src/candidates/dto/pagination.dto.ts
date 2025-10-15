import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { APP_CONSTANTS } from '../../constants/app.constants';

export class PaginationDto {
  @ApiProperty({ description: 'Page number', example: 1, minimum: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(APP_CONSTANTS.DEFAULT_PAGE)
  page?: number = APP_CONSTANTS.DEFAULT_PAGE;

  @ApiProperty({ description: 'Items per page', example: 10, minimum: 1, maximum: 100, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(APP_CONSTANTS.MIN_LIMIT)
  @Max(APP_CONSTANTS.MAX_LIMIT)
  limit?: number = APP_CONSTANTS.DEFAULT_LIMIT;
}
