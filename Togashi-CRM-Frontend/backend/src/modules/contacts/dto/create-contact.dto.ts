import { IsString, IsOptional, IsIn, MaxLength, IsEmail, Matches, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContactStatus } from '../interfaces/contact.interface';

export class CreateContactDto {
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Mukasa' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+256 701 200 300' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Matches(/^[+\d\s\-().]{5,30}$/, { message: 'Phone number format is invalid' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Job title', example: 'CEO' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Company ID' })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Company name', example: 'Amira Interiors' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  companyName?: string;

  @ApiPropertyOptional({ description: 'Status', enum: ['ACTIVE', 'PROSPECT', 'INACTIVE'], default: 'ACTIVE' })
  @IsOptional()
  @IsIn(['ACTIVE', 'PROSPECT', 'INACTIVE'])
  status?: ContactStatus;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
