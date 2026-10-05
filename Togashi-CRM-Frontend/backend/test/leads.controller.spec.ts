import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from '../src/modules/leads/leads.controller';
import { LeadsService } from '../src/modules/leads/leads.service';
import { SupabaseService } from '../src/supabase/supabase.service';
import { AuthenticatedUser } from '../src/common/interfaces/authenticated-user.interface';
import { Lead, LeadListResponse, LeadStats, LeadConvertResult } from '../src/modules/leads/interfaces/lead.interface';

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

const mockLead: Lead = {
  id: 'lead-1',
  organizationId: 'org-1',
  name: 'Amina Wanjiku',
  email: 'amina@example.com',
  phone: '+256 701 200 300',
  company: 'Katrina Fashion Finds',
  source: 'Website',
  status: 'New',
  score: 0,
  temperature: 'Warm',
  ownerId: 'test-uid',
  ownerName: 'Test User',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const mockListResponse: LeadListResponse = {
  data: [mockLead],
  total: 1,
  page: 1,
  limit: 25,
};

const mockStats: LeadStats = {
  total: 1,
  byStatus: [{ status: 'New', count: 1 }],
  byTemperature: [{ temperature: 'Warm', count: 1 }],
  bySource: [{ source: 'Website', count: 1 }],
};

describe('LeadsController', () => {
  let controller: LeadsController;
  let service: jest.Mocked<LeadsService>;

  beforeEach(async () => {
    const mockService = {
      list: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      convert: jest.fn(),
      getStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [
        { provide: LeadsService, useValue: mockService },
        { provide: SupabaseService, useValue: {} },
      ],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
    service = module.get(LeadsService);
  });

  describe('list', () => {
    it('should return paginated leads', async () => {
      service.list.mockResolvedValue(mockListResponse);

      const result = await controller.list(mockUser, {
        limit: 25,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      expect(result).toEqual(mockListResponse);
      expect(service.list).toHaveBeenCalledWith(mockUser, expect.objectContaining({ limit: 25 }));
    });

    it('should pass search and status filters', async () => {
      service.list.mockResolvedValue(mockListResponse);

      await controller.list(mockUser, {
        search: 'Amina',
        status: 'New',
        limit: 25,
        page: 1,
      });

      expect(service.list).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({ search: 'Amina', status: 'New' }),
      );
    });

    it('should fall back to the DEV user when no authenticated user is provided', async () => {
      service.list.mockResolvedValue(mockListResponse);

      await controller.list(undefined, { limit: 25 });

      const resolvedUser = service.list.mock.calls[0][0];
      expect(resolvedUser.organizationId).toBe('00000000-0000-0000-0000-000000000001');
      expect(resolvedUser.uid).toBe('3c56a82e-d087-4132-97c1-25593366ae48');
    });
  });

  describe('stats', () => {
    it('should return aggregated lead stats', async () => {
      service.getStats.mockResolvedValue(mockStats);

      const result = await controller.stats(mockUser);

      expect(result).toEqual(mockStats);
      expect(service.getStats).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a lead by ID', async () => {
      service.findById.mockResolvedValue(mockLead);

      const result = await controller.findOne(mockUser, 'lead-1');

      expect(result).toEqual(mockLead);
      expect(service.findById).toHaveBeenCalledWith(mockUser, 'lead-1');
    });
  });

  describe('create', () => {
    it('should create and return a new lead', async () => {
      service.create.mockResolvedValue(mockLead);

      const result = await controller.create(mockUser, {
        name: 'Amina Wanjiku',
        email: 'amina@example.com',
        status: 'New',
      });

      expect(result).toEqual(mockLead);
      expect(service.create).toHaveBeenCalledWith(
        mockUser,
        expect.objectContaining({ name: 'Amina Wanjiku', email: 'amina@example.com' }),
      );
    });
  });

  describe('update', () => {
    it('should update and return a lead', async () => {
      const updated = { ...mockLead, company: 'Amira Interiors' };
      service.update.mockResolvedValue(updated);

      const result = await controller.update(mockUser, 'lead-1', {
        company: 'Amira Interiors',
      });

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(
        mockUser,
        'lead-1',
        expect.objectContaining({ company: 'Amira Interiors' }),
      );
    });
  });

  describe('remove', () => {
    it('should soft-delete a lead and return success', async () => {
      service.softDelete.mockResolvedValue(undefined);

      const result = await controller.remove(mockUser, 'lead-1');

      expect(service.softDelete).toHaveBeenCalledWith(mockUser, 'lead-1');
      expect(result).toEqual({ success: true });
    });
  });

  describe('convert', () => {
    it('should convert a lead', async () => {
      const result: LeadConvertResult = {};
      service.convert.mockResolvedValue(result);

      const response = await controller.convert(mockUser, 'lead-1', {
        createContact: true,
        createCompany: true,
      });

      expect(response).toEqual(result);
      expect(service.convert).toHaveBeenCalledWith(
        mockUser,
        'lead-1',
        expect.objectContaining({ createContact: true, createCompany: true }),
      );
    });
  });
});