import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OnboardingDto } from './dto/onboarding.dto';
import { AuthService } from './auth.service';
import { SupabaseGuard } from './guards/supabase-auth.guard';
import type { UserProfile } from './guards/supabase-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('onboarding')
  onboarding(@Body() dto: OnboardingDto) {
    return this.authService.onboarding(dto);
  }

  @Get('me')
  @UseGuards(SupabaseGuard)
  getMe(@CurrentUser() user: UserProfile) {
    return this.authService.getMe(user.id);
  }
}
