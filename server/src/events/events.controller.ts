import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { DogadjajService } from './events.service';
import { CreateDogadjajDto } from './dto/create-dogadjaj.dto';
import { SupabaseGuard } from 'src/auth/guards/supabase-auth.guard';
import type { UserProfile } from 'src/auth/guards/supabase-auth.guard';
import { DogadjajiQueryDto } from './dto/dogadjaji-query.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { PrijavaTimaDto } from './dto/prijava-tima.dto';

@Controller('dogadjaj')
export class DogadjajController {
  constructor(private readonly dogadjajService: DogadjajService) {}

  @Post()
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles('moderator')
  createEvent(@Body() createDogadjajDto: CreateDogadjajDto) {
    return this.dogadjajService.create(createDogadjajDto);
  }

  @Get()
  @UseGuards(SupabaseGuard)
  async getEvents(
    @Query() queryDto: DogadjajiQueryDto,
    @CurrentUser() user: UserProfile,
  ) {
    return this.dogadjajService.findAll(queryDto, user.id);
  }

  @Post('prijava')
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles('team')
  async joinEvent(
    @Body() prijavaTimaDto: PrijavaTimaDto,
    @CurrentUser() user: UserProfile,
  ) {
    return this.dogadjajService.prijavaTima(prijavaTimaDto, user.id);
  }

  @Post(':id/favorites')
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles('team')
  async toggleFavorite(
    @Param('id', ParseIntPipe) dogadjajId: number,
    @CurrentUser() user: UserProfile,
  ) {
    return this.dogadjajService.toggleOmiljeniDogadjaj(user.id, dogadjajId);
  }

  @Get(':dogadjajId/tim/:timId/clanovi')
  @UseGuards(SupabaseGuard)
  async getClanoviUcesnici(
    @Param('dogadjajId', ParseIntPipe) dogadjajId: number,
    @Param('timId', ParseIntPipe) timId: number,
  ) {
    return this.dogadjajService.getClanoviUcesnici(dogadjajId, timId);
  }

  @Put(':id/roster')
  @UseGuards(SupabaseGuard, RolesGuard)
  @Roles('team')
  updateRoster(
    @Param('id', ParseIntPipe) dogadjajId: number,
    @Body() dto: PrijavaTimaDto,
    @CurrentUser() user: UserProfile,
  ) {
    return this.dogadjajService.updateRoster(dogadjajId, dto, user.id);
  }
}
