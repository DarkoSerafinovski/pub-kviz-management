import { Injectable, NotFoundException } from '@nestjs/common';
import { google } from 'googleapis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dogadjaj } from '../events/entities/dogadjaj.entity';

@Injectable()
export class GoogleCalendarService {
  constructor(
    @InjectRepository(Dogadjaj)
    private eventRepo: Repository<Dogadjaj>,
  ) {}

  private getClient() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  getAuthUrl(dogadjajId: string) {
    console.log(dogadjajId);
    const client = this.getClient();
    console.log(client);
    return client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.events'],
      prompt: 'consent',
      state: dogadjajId,
    });
  }

  async getTokens(code: string) {
    const client = this.getClient();
    const { tokens } = await client.getToken(code);
    return tokens;
  }
  async storeEvent(dogadjajId: number, token: any) {
    const dogadjaj = await this.eventRepo.findOne({
      where: { id: dogadjajId },
    });
    if (!dogadjaj) throw new NotFoundException('Događaj nije pronađen');

    const client = this.getClient();
    client.setCredentials(token);

    const calendar = google.calendar({ version: 'v3', auth: client });

    const start = new Date(dogadjaj.datum_odrzavanja);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

    try {
      const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: `Pub Kviz: ${dogadjaj.naziv}`,
          description: 'Uspešno ste se prijavili za kviz!',
          start: {
            dateTime: start.toISOString(),
            timeZone: 'Europe/Belgrade',
          },
          end: {
            dateTime: end.toISOString(),
            timeZone: 'Europe/Belgrade',
          },
          reminders: {
            useDefault: false,
            overrides: [{ method: 'popup', minutes: 480 }],
          },
        },
      });
      return res.data;
    } catch (err) {
      console.error('Google API Error:', err.response?.data || err.message);
      throw err;
    }
  }

  generateSuccessHtml(tokens: any): string {
    return `
    <html>
      <body style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background-color: #f4f4f9;">
        <div style="text-align: center; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); background: white;">
          <h2 style="color: #4CAF50;">Autorizacija uspješna!</h2>
          <p>Sada se vraćate u aplikaciju, molimo sačekajte...</p>
        </div>
        <script>
          const token = ${JSON.stringify(tokens)};
          // Šaljemo token React aplikaciji
          window.opener.postMessage(
            { type: "GOOGLE_AUTH_SUCCESS", token: token },
            "http://localhost:3001" // OBAVEZNO: URL tvog React frontenda
          );
          // Zatvori popup nakon 1.5 sekunde
          setTimeout(() => window.close(), 1500);
        </script>
      </body>
    </html>
  `;
  }
}
