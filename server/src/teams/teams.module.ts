import { Module } from '@nestjs/common';
import { TimoviService } from './teams.service';
import { TimoviController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clan } from './entities/clan.entity';
import { Tim } from './entities/team.entity';
import { DogadjajTim } from 'src/results/entities/dogadjaj-tim.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clan, DogadjajTim, Tim])],
  controllers: [TimoviController],
  providers: [TimoviService],
  exports: [TypeOrmModule],
})
export class TimoviModule {}
