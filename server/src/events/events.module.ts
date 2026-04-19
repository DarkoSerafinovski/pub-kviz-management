import { Module } from '@nestjs/common';
import { DogadjajService } from './events.service';
import { DogadjajController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dogadjaj } from './entities/dogadjaj.entity';
import { OmiljeniDogadjaj } from './entities/omiljeni-dogadjaji.entity';
import { Sezona } from 'src/seasons/entities/sezona.entity';
import { Profile } from 'src/users/entities/profile.entity';
import { DogadjajTim } from 'src/results/entities/dogadjaj-tim.entity';
import { Clan } from 'src/teams/entities/clan.entity';
import { ClanUcesce } from 'src/teams/entities/clan-ucesce.entity';
import { Tim } from 'src/teams/entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dogadjaj,
      OmiljeniDogadjaj,
      Sezona,
      Profile,
      DogadjajTim,
      Clan,
      ClanUcesce,
      Tim,
    ]),
  ],
  controllers: [DogadjajController],
  providers: [DogadjajService],
  exports: [TypeOrmModule],
})
export class DogadjajModule {}
