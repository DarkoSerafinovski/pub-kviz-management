import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Clan } from './entities/clan.entity';
import { Repository } from 'typeorm';
import { DogadjajTim } from 'src/results/entities/dogadjaj-tim.entity';
import { Tim } from './entities/team.entity';
import { formatDate } from 'src/common/utils/date-util';

type StatistikaSezone = {
  sezona_id: number;
  pocetak: Date;
  kraj: Date;
  broj_dogadjaja: number;
  suma_poena: number;
  avg_poena: number;
  broj_pobeda: number;
  pozicija_na_listi: number;
};

@Injectable()
export class TimoviService {
  constructor(
    @InjectRepository(Clan)
    private readonly memberRepo: Repository<Clan>,
    @InjectRepository(DogadjajTim)
    private readonly eventTeamRepo: Repository<DogadjajTim>,
    @InjectRepository(Tim)
    private readonly teamRepo: Repository<Tim>,
  ) {}

  async getAllClanovi() {
    const clanovi = await this.memberRepo.find({
      order: {
        ime: 'ASC',
      },
    });

    return {
      success: true,
      message: 'Lista svih članova uspešno učitana.',
      data: clanovi,
    };
  }

  async izracunajPobede(timId: number, sezonaId?: number) {
    const qb = this.eventTeamRepo
      .createQueryBuilder('dt')
      .leftJoinAndSelect('dt.dogadjaj', 'dogadjaj')
      .leftJoinAndSelect('dt.tim', 'tim')
      .select([
        'dt.id',
        'dt.score',
        'dt.dogadjaj_id',
        'dt.tim_id',
        'dogadjaj.id',
        'dogadjaj.sezona_id',
        'tim.id',
      ]);

    if (sezonaId) {
      qb.where('dogadjaj.sezona_id = :sezonaId', { sezonaId });
    }

    const ucesca = await qb.getMany();

    const poDogadjaju = new Map<number, any[]>();

    for (const u of ucesca) {
      const dId = u.dogadjaj.id;
      if (!poDogadjaju.has(dId)) {
        poDogadjaju.set(dId, []);
      }
      poDogadjaju.get(dId)!.push(u);
    }

    let pobede = 0;

    for (const [, lista] of poDogadjaju) {
      const max = Math.max(...lista.map((x) => x.score));

      const moj = lista.find((x) => x.tim.id === timId);

      if (moj && moj.score === max && max > 0) {
        pobede++;
      }
    }

    return pobede;
  }

  async izracunajPozicijuUSezoni(timId: number, sezonaId: number) {
    const data = await this.eventTeamRepo
      .createQueryBuilder('dt')
      .leftJoin('dt.dogadjaj', 'dogadjaj')
      .select(['dt.id', 'dt.tim_id', 'dt.score'])
      .where('dogadjaj.sezona_id = :sezonaId', { sezonaId })
      .getMany();

    const rang = new Map<number, number>();

    for (const d of data) {
      const tId = d.tim_id;
      const trenutniScore = rang.get(tId) || 0;
      rang.set(tId, trenutniScore + d.score);
    }

    const sorted = [...rang.entries()]
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score);

    const index = sorted.findIndex((t) => t.id === timId);

    return index === -1 ? 0 : index + 1;
  }

  async getStatistika(userId: string) {
    const tim = await this.teamRepo.findOne({
      where: { profile: { id: userId } },
    });

    if (!tim) {
      throw new NotFoundException('Tim nije pronađen.');
    }

    const timId = tim.id;

    const ucesca = await this.eventTeamRepo.find({
      where: { tim: { id: timId } },
      relations: ['dogadjaj', 'dogadjaj.sezona'],
    });

    const ukupanBrojDogadjaja = ucesca.length;

    const suma = ucesca.reduce((a, b) => a + b.score, 0);

    const max = ucesca.length ? Math.max(...ucesca.map((u) => u.score)) : 0;

    const avg = ukupanBrojDogadjaja ? suma / ukupanBrojDogadjaja : 0;

    const sezonaMap = new Map<number, any>();

    for (const u of ucesca) {
      const s = u.dogadjaj.sezona;

      if (!sezonaMap.has(s.id)) {
        sezonaMap.set(s.id, {
          sezona_id: s.id,
          pocetak: formatDate(s.pocetak),
          kraj: formatDate(s.kraj),
          dogadjaji: [],
        });
      }

      sezonaMap.get(s.id).dogadjaji.push(u);
    }

    const statistikaPoSezonama: StatistikaSezone[] = [];

    for (const sezona of sezonaMap.values()) {
      const sezonskiScore = sezona.dogadjaji.reduce((a, b) => a + b.score, 0);

      const maxUSezoni = sezona.dogadjaji.length
        ? Math.max(...sezona.dogadjaji.map((u) => u.score))
        : 0;

      const pobede = await this.izracunajPobede(timId, sezona.sezona_id);
      const pozicija = await this.izracunajPozicijuUSezoni(
        timId,
        sezona.sezona_id,
      );

      statistikaPoSezonama.push({
        ...sezona,
        broj_dogadjaja: sezona.dogadjaji.length,
        suma_poena: sezonskiScore,
        avg_poena: sezona.dogadjaji.length
          ? sezonskiScore / sezona.dogadjaji.length
          : 0,
        max_poena_sezona: maxUSezoni,
        broj_pobeda: pobede,
        pozicija_na_listi: pozicija,
      } as StatistikaSezone);
    }

    const ukupnoPobeda = await this.izracunajPobede(timId);

    return {
      success: true,
      data: {
        ukupan_broj_dogadjaja: ukupanBrojDogadjaja,
        ukupan_broj_osvojenih_dogadjaja: ukupnoPobeda,
        maksimalni_poena_ikada: max,
        prosecan_broj_poena: avg,
        sezone: statistikaPoSezonama,
      },
    };
  }
}
