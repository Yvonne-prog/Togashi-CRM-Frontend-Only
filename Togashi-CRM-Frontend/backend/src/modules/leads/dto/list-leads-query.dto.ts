import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListLeadsQueryDto {
  @ApiPropertyOptional({ description: 'Page size', default: 25, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;

  @ApiPropertyOptional({ description: 'Search term (searches name, email, company, source)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by status', enum: ['New', 'Contacted', 'Qualified', 'Lost'] })
  @IsOptional()
  @IsIn(['New', 'Contacted', 'Qualified', 'Lost'])
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by temperature', enum: ['Hot', 'Warm', 'Cold'] })
  @IsOptional()
  @IsIn(['Hot', 'Warm', 'Cold'])
  temperature?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned owner ID' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Page number for offset-based pagination', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Sort field', enum: ['createdAt', 'updatedAt', 'name', 'email', 'status', 'score', 'company'], default: 'createdAt' })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'name', 'email', 'status', 'score', 'company'])
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort direction', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: string = 'desc';
}