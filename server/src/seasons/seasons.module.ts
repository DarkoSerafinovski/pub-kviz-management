import { Module } from '@nestjs/common';
import { SezoneService } from './seasons.service';
import { SezoneController } from './seasons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sezona } from './entities/sezona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sezona])],
  controllers: [SezoneController],
  providers: [SezoneService],
  exports: [TypeOrmModule],
})
export class SezoneModule {}
