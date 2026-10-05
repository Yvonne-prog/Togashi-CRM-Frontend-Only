import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from './supabase.service';
import { AuthException } from '../common/exceptions';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly supabase: SupabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthException('Missing or invalid authorization header');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new AuthException('Missing authentication token');
    }

    const { data, error } = await this.supabase.client.auth.getUser(token);

    if (error || !data.user) {
      throw new AuthException('Invalid or expired authentication token');
    }

    const { data: profile, error: profileError } = await this.supabase.client
      .from('users')
      .select('*')
      .eq('uid', data.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      throw new AuthException('User profile not found');
    }

    if (profile.isDeleted === true) {
      throw new AuthException('User account has been deleted');
    }

    if (profile.status !== 'ACTIVE') {
      throw new AuthException('User account is not active');
    }

    const { data: org } = await this.supabase.client
      .from('organizations')
      .select('*')
      .eq('id', profile.organizationId)
      .maybeSingle();

    if (!org) {
      throw new AuthException('Organization not found');
    }

    if (org.status !== 'ACTIVE') {
      throw new AuthException('Organization is not active');
    }

    const authenticatedUser: AuthenticatedUser = {
      uid: data.user.id,
      email: data.user.email ?? profile.email,
      organizationId: profile.organizationId,
      organizationName: org.name,
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName ?? `${profile.firstName} ${profile.lastName}`,
      avatarUrl: profile.avatarUrl,
      jobTitle: profile.jobTitle,
      department: profile.department,
      roleCodes: profile.roleCodes ?? [],
      status: profile.status,
      lastLoginAt: profile.lastLoginAt,
    };

    request.user = authenticatedUser;
    return true;
  }
}
