import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ListLeadsQueryDto } from './dto/list-leads-query.dto';
import { ConvertLeadDto } from './dto/convert-lead.dto';
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

@ApiTags('Leads')
@ApiBearerAuth()
@Public()
@Controller('leads')
export class LeadsController {
  private readonly logger = new Logger(LeadsController.name);

  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List leads (paginated, filterable, searchable)' })
  async list(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query() query: ListLeadsQueryDto,
  ) {
    this.logger.log('LeadsController.list — request received');
    return this.leadsService.list(resolveUser(user), query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get lead stats grouped by status, temperature and source' })
  async stats(
    @CurrentUser() user: AuthenticatedUser | undefined,
  ) {
    this.logger.log('LeadsController.stats — request received');
    return this.leadsService.getStats(resolveUser(user));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID' })
  async findOne(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
  ) {
    this.logger.log(`LeadsController.findOne — id=${id}`);
    return this.leadsService.findById(resolveUser(user), id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  async create(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Body() dto: CreateLeadDto,
  ) {
    this.logger.log('LeadsController.create — request received');
    return this.leadsService.create(resolveUser(user), dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead' })
  async update(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
  ) {
    this.logger.log(`LeadsController.update — id=${id}`);
    return this.leadsService.update(resolveUser(user), id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a lead' })
  async remove(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
  ) {
    this.logger.log(`LeadsController.remove — id=${id}`);
    await this.leadsService.softDelete(resolveUser(user), id);
    return { success: true };
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Convert a lead' })
  async convert(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
    @Body() dto: ConvertLeadDto,
  ) {
    this.logger.log(`LeadsController.convert — id=${id}`);
    return this.leadsService.convert(resolveUser(user), id, dto);
  }
}