import { Controller, UseGuards, Get } from '@nestjs/common';
import { TimoviService } from './teams.service';
import type { UserProfile } from 'src/auth/guards/supabase-auth.guard';
import { SupabaseGuard } from 'src/auth/guards/supabase-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('timovi')
export class TimoviController {
  constructor(private readonly timoviService: TimoviService) {}

  @Get('clanovi/svi')
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles('team')
  async prikazSvihClanova() {
    return await this.timoviService.getAllClanovi();
  }

  @Get('statistika')
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles('team')
  async teamStats(@CurrentUser() user: UserProfile) {
    return await this.timoviService.getStatistika(user.id);
  }
}
