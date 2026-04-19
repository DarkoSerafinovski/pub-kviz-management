import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common';
import { SezoneService } from './seasons.service';
import { CreateSezoneDto } from './dto/create-sezone.dto';
import { SupabaseGuard } from 'src/auth/guards/supabase-auth.guard';
import { SezoneQueryDto } from './dto/sezone-query.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('sezone')
export class SezoneController {
  constructor(private readonly sezoneService: SezoneService) {}

  @Post()
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles('moderator')
  async createSeason(@Body() dto: CreateSezoneDto) {
    return this.sezoneService.createSeason(dto);
  }

  @Get()
  @UseGuards(SupabaseGuard)
  async getSeasons(@Query() query: SezoneQueryDto) {
    return this.sezoneService.getSeasons(query);
  }
}
