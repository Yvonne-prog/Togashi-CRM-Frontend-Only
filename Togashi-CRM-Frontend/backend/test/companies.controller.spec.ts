import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from '../src/modules/companies/companies.controller';
import { CompaniesService } from '../src/modules/companies/companies.service';
import { SupabaseService } from '../src/supabase/supabase.service';
import { AuthenticatedUser } from '../src/common/interfaces/authenticated-user.interface';
import { Company, CompanySummary, PaginatedCompanies } from '../src/modules/companies/interfaces/company.interface';

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

const mockCompany: Company = {
  id: 'company-1',
  organizationId: 'org-1',
  name: 'Acme Corp',
  legalName: 'Acme Corp Ltd',
  email: 'info@acme.com',
  phone: '+256 701 200 300',
  website: 'acme.com',
  address: '123 Main St',
  city: 'Kampala',
  country: 'Uganda',
  status: 'ACTIVE',
  industry: 'Technology',
  notes: 'A test company',
  isDeleted: false,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const mockSummary: CompanySummary = { total: 1, active: 1, prospects: 0, inactive: 0 };

const mockPaginated: PaginatedCompanies = {
  items: [mockCompany],
  nextCursor: null,
  hasMore: false,
  total: 1,
  summary: mockSummary,
};

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: jest.Mocked<CompaniesService>;

  beforeEach(async () => {
    const mockService = {
      list: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        { provide: CompaniesService, useValue: mockService },
        { provide: SupabaseService, useValue: {} },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get(CompaniesService);
  });

  describe('list', () => {
    it('should return paginated companies with summary', async () => {
      service.list.mockResolvedValue(mockPaginated);

      const result = await controller.list(mockUser, {
        limit: 20,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result).toEqual(mockPaginated);
      expect(service.list).toHaveBeenCalledWith(mockUser, expect.objectContaining({ limit: 20 }));
    });

    it('should pass search and status filters', async () => {
      service.list.mockResolvedValue(mockPaginated);

      await controller.list(mockUser, {
        search: 'Acme',
        status: 'ACTIVE',
        limit: 20,
        page: 1,
      });

      expect(service.list).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({ search: 'Acme', status: 'ACTIVE' }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a company by ID', async () => {
      service.findById.mockResolvedValue(mockCompany);

      const result = await controller.findOne(mockUser, 'company-1');

      expect(result).toEqual(mockCompany);
      expect(service.findById).toHaveBeenCalledWith(mockUser, 'company-1');
    });
  });

  describe('create', () => {
    it('should create and return a new company', async () => {
      service.create.mockResolvedValue(mockCompany);

      const result = await controller.create(mockUser, {
        name: 'Acme Corp',
        industry: 'Technology',
        status: 'ACTIVE',
      });

      expect(result).toEqual(mockCompany);
      expect(service.create).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({ name: 'Acme Corp', industry: 'Technology' }),
      );
    });
  });

  describe('update', () => {
    it('should update and return a company', async () => {
      const updated = { ...mockCompany, name: 'Acme Updated' };
      service.update.mockResolvedValue(updated);

      const result = await controller.update(mockUser, 'company-1', {
        name: 'Acme Updated',
      });

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(
        mockUser,
        'company-1',
        expect.objectContaining({ name: 'Acme Updated' }),
      );
    });
  });

  describe('remove', () => {
    it('should soft-delete a company', async () => {
      service.softDelete.mockResolvedValue(undefined);

      await controller.remove(mockUser, 'company-1');

      expect(service.softDelete).toHaveBeenCalledWith(mockUser, 'company-1');
    });
  });
});
