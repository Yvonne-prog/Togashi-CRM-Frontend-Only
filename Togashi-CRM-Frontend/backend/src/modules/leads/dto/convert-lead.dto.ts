import { IsBoolean, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ConvertLeadDto {
  @ApiPropertyOptional({ description: 'Create a contact from the lead', default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  createContact?: boolean = true;

  @ApiPropertyOptional({ description: 'Create a company from the lead', default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  createCompany?: boolean = true;

  @ApiPropertyOptional({ description: 'Create a deal from the lead', default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  createDeal?: boolean = false;

  @ApiPropertyOptional({ description: 'Deal title' })
  @IsOptional()
  @IsString()
  dealTitle?: string;

  @ApiPropertyOptional({ description: 'Deal value' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  dealValue?: number;

  @ApiPropertyOptional({ description: 'Deal stage' })
  @IsOptional()
  @IsString()
  dealStage?: string;
}