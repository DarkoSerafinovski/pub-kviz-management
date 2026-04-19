import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import type { Response } from 'express';

@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(private readonly calendarService: GoogleCalendarService) {}

  @Get('auth-url')
  getAuthUrl(@Query('dogadjaj_id') dogadjajId: string) {
    const url = this.calendarService.getAuthUrl(dogadjajId);
    return { url };
  }
  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    try {
      const tokens = await this.calendarService.getTokens(code);
      const html = this.calendarService.generateSuccessHtml(tokens);

      return res.send(html);
    } catch (error) {
      console.error('Greška:', error);
      return res.status(500).send('Greška pri autorizaciji.');
    }
  }
  @Post('store-event')
  async storeEvent(
    @Body('dogadjaj_id') dogadjajId: number,
    @Body('token') token: any,
  ) {
    const event = await this.calendarService.storeEvent(dogadjajId, token);
    return { success: true, event_id: event.id };
  }
}
