import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRezultatDto } from './dto/update-rezultati.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DogadjajTim } from './entities/dogadjaj-tim.entity';
import { Repository } from 'typeorm';
import { Dogadjaj } from 'src/events/entities/dogadjaj.entity';
import { Sezona } from 'src/seasons/entities/sezona.entity';
import { formatDate } from 'src/common/utils/date-util';

@Injectable()
export class RezultatiService {
  constructor(
    @InjectRepository(DogadjajTim)
    private readonly eventTeamRepo: Repository<DogadjajTim>,
    @InjectRepository(Sezona)
    private readonly seasonRepo: Repository<Sezona>,
  ) {}

  async updateRezultat(dto: UpdateRezultatDto) {
    const { dogadjaj_id, tim_id, score } = dto;

    const veza = await this.eventTeamRepo.findOne({
      where: {
        dogadjaj: { id: dogadjaj_id },
        tim: { id: tim_id },
      },
      relations: ['tim'],
    });

    if (!veza) {
      throw new NotFoundException('Izabrani tim nije deo ovog događaja.');
    }

    veza.score = score;

    const updated = await this.eventTeamRepo.save(veza);

    return {
      success: true,
      message: 'Rezultat je uspešno ažuriran.',
      data: {
        tim_id: updated.tim.id,
        naziv_tima: updated.tim.naziv,
        logo: updated.tim.logo ? `.../${updated.tim.logo}` : null,
        score: updated.score,
      },
    };
  }

  async getRangLista(dogadjajId: number) {
    const dogadjaj = await this.eventTeamRepo.manager.findOne(Dogadjaj, {
      where: { id: dogadjajId },
    });

    if (!dogadjaj) {
      throw new NotFoundException('Događaj nije pronađen.');
    }

    const rezultati = await this.eventTeamRepo.find({
      where: {
        dogadjaj: { id: dogadjajId },
      },
      relations: ['tim'],
      order: {
        score: 'DESC',
      },
    });

    return {
      success: true,
      message: `Rang lista za događaj "${dogadjaj.naziv}" uspešno učitana.`,
      data: rezultati.map((item) => ({
        tim_id: item.tim.id,
        naziv_tima: item.tim.naziv,
        logo: item.tim.logo ? `${item.tim.logo}` : null,
        score: item.score,
      })),
    };
  }

  async getRangListaSezone(sezonaId: number) {
    const sezona = await this.seasonRepo.findOne({
      where: { id: sezonaId },
    });

    if (!sezona) {
      throw new NotFoundException('Sezona nije pronađena.');
    }

    const ucesca = await this.eventTeamRepo.find({
      relations: ['tim', 'dogadjaj', 'dogadjaj.sezona'],
    });

    const filtrirano = ucesca.filter((u) => u.dogadjaj.sezona.id === sezonaId);

    const map = new Map<
      number,
      {
        tim_id: number;
        naziv_tima: string;
        logo: string | null;
        score: number;
      }
    >();

    for (const u of filtrirano) {
      const timId = u.tim.id;

      if (!map.has(timId)) {
        map.set(timId, {
          tim_id: timId,
          naziv_tima: u.tim.naziv,
          logo: u.tim.logo ?? null,
          score: 0,
        });
      }

      map.get(timId)!.score += u.score;
    }

    const rangLista = [...map.values()].sort((a, b) => b.score - a.score);

    return {
      success: true,
      message: 'Generalni plasman za sezonu uspešno učitan.',
      sezona_period: `${formatDate(sezona.pocetak)} / ${formatDate(sezona.kraj)}`,
      data: rangLista,
    };
  }
}
