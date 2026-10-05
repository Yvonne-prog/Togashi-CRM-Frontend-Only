import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortDirection } from '../enums';

export class SortingDto {
  @ApiPropertyOptional({ description: 'Field to sort by', enum: ['createdAt', 'updatedAt', 'name', 'status'] })
  @IsOptional()
  @IsIn(['createdAt', 'updatedAt', 'name', 'status'])
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort direction', enum: SortDirection, default: SortDirection.DESC })
  @IsOptional()
  @IsIn([SortDirection.ASC, SortDirection.DESC])
  sortDirection?: SortDirection = SortDirection.DESC;
}
