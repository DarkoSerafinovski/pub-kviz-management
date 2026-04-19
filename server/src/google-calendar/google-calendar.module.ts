import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { GoogleCalendarController } from './google-calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dogadjaj } from 'src/events/entities/dogadjaj.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dogadjaj])],
  controllers: [GoogleCalendarController],
  providers: [GoogleCalendarService],
})
export class GoogleCalendarModule {}
