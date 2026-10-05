import { IsString, IsOptional, IsIn, Min, MaxLength, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus, LeadTemperature } from '../interfaces/lead.interface';

export class UpdateLeadDto {
  @ApiPropertyOptional({ description: 'Full name of the lead' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  company?: string;

  @ApiPropertyOptional({ description: 'Lead source' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @ApiPropertyOptional({ description: 'Product/service of interest' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  interest?: string;

  @ApiPropertyOptional({ description: 'Estimated budget' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estimatedBudget?: number;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({ description: 'Lead status', enum: ['New', 'Contacted', 'Qualified', 'Lost'] })
  @IsOptional()
  @IsIn(['New', 'Contacted', 'Qualified', 'Lost'])
  status?: LeadStatus;

  @ApiPropertyOptional({ description: 'Lead temperature', enum: ['Hot', 'Warm', 'Cold'] })
  @IsOptional()
  @IsIn(['Hot', 'Warm', 'Cold'])
  temperature?: LeadTemperature;

  @ApiPropertyOptional({ description: 'Owner user ID', format: 'uuid' })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({ description: 'Expected decision date' })
  @IsOptional()
  @IsString()
  expectedDecisionDate?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Next action' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  nextAction?: string;
}