import { IsString, IsOptional, IsIn, Min, MaxLength, IsEmail, Matches, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus, LeadTemperature } from '../interfaces/lead.interface';

export class CreateLeadDto {
  @ApiProperty({ description: 'Full name of the lead', example: 'Amina Wanjiku' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ description: 'Email address', example: 'amina@example.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+256 701 200 300' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Matches(/^[+\d\s\-().]{5,30}$/, { message: 'Phone number format is invalid' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Company name', example: 'Katrina Fashion Finds' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  company?: string;

  @ApiPropertyOptional({ description: 'Lead source', example: 'Website' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @ApiPropertyOptional({ description: 'Product/service of interest', example: 'CRM Subscription' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  interest?: string;

  @ApiPropertyOptional({ description: 'Estimated budget', example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estimatedBudget?: number;

  @ApiPropertyOptional({ description: 'Currency code', example: 'UGX' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiProperty({ description: 'Lead status', enum: ['New', 'Contacted', 'Qualified', 'Lost'], default: 'New' })
  @IsIn(['New', 'Contacted', 'Qualified', 'Lost'])
  status: LeadStatus;

  @ApiPropertyOptional({ description: 'Lead temperature', enum: ['Hot', 'Warm', 'Cold'] })
  @IsOptional()
  @IsIn(['Hot', 'Warm', 'Cold'])
  temperature?: LeadTemperature;

  @ApiPropertyOptional({ description: 'Owner user ID', format: 'uuid' })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({ description: 'Expected decision date', example: '2026-01-15' })
  @IsOptional()
  @IsString()
  expectedDecisionDate?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Next action', example: 'Follow up with demo' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  nextAction?: string;
}
