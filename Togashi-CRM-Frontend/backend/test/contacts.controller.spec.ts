import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from '../src/modules/contacts/contacts.controller';
import { ContactsService } from '../src/modules/contacts/contacts.service';
import { SupabaseService } from '../src/supabase/supabase.service';
import { AuthenticatedUser } from '../src/common/interfaces/authenticated-user.interface';
import { Contact, ContactSummary, PaginatedContacts } from '../src/modules/contacts/interfaces/contact.interface';

const mockUser: AuthenticatedUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  organizationId: 'org-1',
  organizationName: 'Test Org',
  firstName: 'Test',
  lastName: 'User',
  displayName: 'Test User',
  roleCodes: ['ADMIN'],
  status: 'ACTIVE',
};

const mockContact: Contact = {
  id: 'contact-1',
  organizationId: 'org-1',
  firstName: 'John',
  lastName: 'Mukasa',
  fullName: 'John Mukasa',
  fullNameNormalized: 'john mukasa',
  email: 'john@example.com',
  phone: '+256 701 200 300',
  jobTitle: 'CEO',
  companyId: 'company-1',
  companyName: 'Amira Interiors',
  status: 'ACTIVE',
  ownerId: 'test-uid',
  ownerName: 'Test User',
  notes: 'A test contact',
  createdAt: '2025-01-01T00:00:00.000Z',
  createdBy: 'test-uid',
  updatedAt: '2025-01-01T00:00:00.000Z',
  updatedBy: 'test-uid',
  isDeleted: false,
};

const mockSummary: ContactSummary = { total: 1, active: 1, prospects: 0, inactive: 0 };

const mockPaginated: PaginatedContacts = {
  items: [mockContact],
  nextCursor: null,
  hasMore: false,
  total: 1,
  summary: mockSummary,
};

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: jest.Mocked<ContactsService>;

  beforeEach(async () => {
    const mockService = {
      list: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        { provide: ContactsService, useValue: mockService },
        { provide: SupabaseService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get(ContactsService);
  });

  describe('list', () => {
    it('should return paginated contacts with summary', async () => {
      service.list.mockResolvedValue(mockPaginated);

      const result = await controller.list(mockUser, {
        limit: 20,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });

      expect(result).toEqual(mockPaginated);
      expect(service.list).toHaveBeenCalledWith(mockUser, expect.objectContaining({ limit: 20 }));
    });

    it('should pass search and status filters', async () => {
      service.list.mockResolvedValue(mockPaginated);

      await controller.list(mockUser, {
        search: 'John',
        status: 'ACTIVE',
        limit: 20,
      });

      expect(service.list).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({ search: 'John', status: 'ACTIVE' }),
      );
    });

    it('should fall back to the DEV user when no authenticated user is provided', async () => {
      service.list.mockResolvedValue(mockPaginated);

      await controller.list(undefined, { limit: 20 });

      const resolvedUser = service.list.mock.calls[0][0];
      expect(resolvedUser.organizationId).toBe('00000000-0000-0000-0000-000000000001');
      expect(resolvedUser.uid).toBe('3c56a82e-d087-4132-97c1-25593366ae48');
    });
  });

  describe('findOne', () => {
    it('should return a contact by ID', async () => {
      service.findById.mockResolvedValue(mockContact);

      const result = await controller.findOne(mockUser, 'contact-1');

      expect(result).toEqual(mockContact);
      expect(service.findById).toHaveBeenCalledWith(mockUser, 'contact-1');
    });
  });

  describe('create', () => {
    it('should create and return a new contact', async () => {
      service.create.mockResolvedValue(mockContact);

      const result = await controller.create(mockUser, {
        firstName: 'John',
        lastName: 'Mukasa',
        email: 'john@example.com',
        status: 'ACTIVE',
      });

      expect(result).toEqual(mockContact);
      expect(service.create).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({ firstName: 'John', lastName: 'Mukasa' }),
      );
    });
  });

  describe('update', () => {
    it('should update and return a contact', async () => {
      const updated = { ...mockContact, jobTitle: 'CTO' };
      service.update.mockResolvedValue(updated);

      const result = await controller.update(mockUser, 'contact-1', {
        jobTitle: 'CTO',
      });

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(
        mockUser,
        'contact-1',
        expect.objectContaining({ jobTitle: 'CTO' }),
      );
    });
  });

  describe('remove', () => {
    it('should soft-delete a contact', async () => {
      service.softDelete.mockResolvedValue(undefined);

      await controller.remove(mockUser, 'contact-1');

      expect(service.softDelete).toHaveBeenCalledWith(mockUser, 'contact-1');
    });
  });
});