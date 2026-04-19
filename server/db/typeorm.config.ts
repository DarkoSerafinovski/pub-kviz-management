import { config } from 'dotenv';
import { Profile } from 'src/users/entities/profile.entity';
import { DogadjajTim } from 'src/results/entities/dogadjaj-tim.entity';
import { Dogadjaj } from 'src/events/entities/dogadjaj.entity';
import { Sezona } from 'src/seasons/entities/sezona.entity';
import { Clan } from 'src/teams/entities/clan.entity';
import { ClanUcesce } from 'src/teams/entities/clan-ucesce.entity';
import { Tim } from 'src/teams/entities/team.entity';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Profile, Sezona, Dogadjaj, Tim, Clan, DogadjajTim, ClanUcesce],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
