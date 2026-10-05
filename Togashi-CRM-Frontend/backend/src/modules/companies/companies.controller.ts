import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { DEV_ORGANIZATION_ID, DEV_USER_UID } from '../../common/constants';

const DEV_USER: AuthenticatedUser = {
  uid: DEV_USER_UID,
  email: 'admin@togashi.dev',
  organizationId: DEV_ORGANIZATION_ID,
  organizationName: 'Togashi Technologies',
  firstName: 'Togashi',
  lastName: 'Admin',
  displayName: 'Togashi Admin',
  roleCodes: ['ADMIN'],
  status: 'ACTIVE',
};

function resolveUser(user: AuthenticatedUser | undefined): AuthenticatedUser {
  return user ?? DEV_USER;
}

@ApiTags('Companies')
@ApiBearerAuth()
@Public()
@Controller('companies')
export class CompaniesController {
  private readonly logger = new Logger(CompaniesController.name);

  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'List companies (paginated, filterable, searchable)' })
  async list(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query() query: ListCompaniesQueryDto,
  ) {
    this.logger.log('CompaniesController.list — request received');
    return this.companiesService.list(resolveUser(user), query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  async findOne(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
  ) {
    this.logger.log(`CompaniesController.findOne — id=${id}`);
    return this.companiesService.findById(resolveUser(user), id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  async create(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Body() dto: CreateCompanyDto,
  ) {
    this.logger.log('CompaniesController.create — request received');
    return this.companiesService.create(resolveUser(user), dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  async update(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
  ) {
    this.logger.log(`CompaniesController.update — id=${id}`);
    return this.companiesService.update(resolveUser(user), id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a company' })
  async remove(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
  ) {
    this.logger.log(`CompaniesController.remove — id=${id}`);
    await this.companiesService.softDelete(resolveUser(user), id);
  }
}
