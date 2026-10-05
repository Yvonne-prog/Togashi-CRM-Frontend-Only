import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  async me(@CurrentUser() user: AuthenticatedUser) {
    return {
      uid: user.uid,
      organization: user.organizationName,
      name: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatarUrl ?? null,
      jobTitle: user.jobTitle ?? null,
      department: user.department ?? null,
      roleCodes: user.roleCodes,
      status: user.status,
      lastLoginAt: user.lastLoginAt ?? null,
    };
  }
}
