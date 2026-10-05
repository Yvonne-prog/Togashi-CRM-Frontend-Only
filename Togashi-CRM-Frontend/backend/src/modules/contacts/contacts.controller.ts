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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ListContactsQueryDto } from './dto/list-contacts-query.dto';
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

@ApiTags('Contacts')
@ApiBearerAuth()
@Public()
@Controller('contacts')
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'List contacts (paginated, filterable, searchable)' })
  async list(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Query() query: ListContactsQueryDto,
  ) {
    this.logger.log('ContactsController.list — request received');
    return this.contactsService.list(resolveUser(user), query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  async findOne(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
  ) {
    this.logger.log(`ContactsController.findOne — id=${id}`);
    return this.contactsService.findById(resolveUser(user), id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  async create(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Body() dto: CreateContactDto,
  ) {
    this.logger.log('ContactsController.create — request received');
    return this.contactsService.create(resolveUser(user), dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  async update(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    this.logger.log(`ContactsController.update — id=${id}`);
    return this.contactsService.update(resolveUser(user), id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a contact' })
  async remove(
    @CurrentUser() user: AuthenticatedUser | undefined,
    @Param('id') id: string,
  ) {
    this.logger.log(`ContactsController.remove — id=${id}`);
    await this.contactsService.softDelete(resolveUser(user), id);
  }
}