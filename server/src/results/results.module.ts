import { Module } from '@nestjs/common';
import { RezultatiService } from './results.service';
import { RezultatiController } from './results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogadjajTim } from './entities/dogadjaj-tim.entity';
import { Sezona } from 'src/seasons/entities/sezona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DogadjajTim, Sezona])],
  controllers: [RezultatiController],
  providers: [RezultatiService],
  exports: [TypeOrmModule],
})
export class RezultatiModule {}
