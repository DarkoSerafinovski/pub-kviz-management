import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { RezultatiService } from './results.service';
import { UpdateRezultatDto } from './dto/update-rezultati.dto';
import { SupabaseGuard } from 'src/auth/guards/supabase-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('rezultati')
export class RezultatiController {
  constructor(private readonly rezultatiService: RezultatiService) {}

  @Patch()
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles('moderator')
  async updateScore(@Body() updateDto: UpdateRezultatDto) {
    return this.rezultatiService.updateRezultat(updateDto);
  }

  @Get(':id/rang-lista-dogadjaja')
  @UseGuards(SupabaseGuard)
  async getEventRanking(@Param('id', ParseIntPipe) dogadjajId: number) {
    return this.rezultatiService.getRangLista(dogadjajId);
  }

  @Get(':id/rang-lista-sezone')
  @UseGuards(SupabaseGuard)
  async getSeasonRanking(@Param('id', ParseIntPipe) sezonaId: number) {
    return this.rezultatiService.getRangListaSezone(sezonaId);
  }
}
