import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSezoneDto } from './dto/create-sezone.dto';
import { SezoneQueryDto } from './dto/sezone-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sezona } from './entities/sezona.entity';
import { Repository } from 'typeorm';
import { formatDate } from 'src/common/utils/date-util';

@Injectable()
export class SezoneService {
  constructor(
    @InjectRepository(Sezona)
    private readonly sezonaRepository: Repository<Sezona>,
  ) {}

  async createSeason(data: CreateSezoneDto) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(data.pocetak);
    const endDate = new Date(data.kraj);

    if (startDate <= today) {
      throw new BadRequestException('Sezona mora početi najranije sutra!');
    }

    if (endDate <= startDate) {
      throw new BadRequestException(
        'Datum završetka mora biti nakon datuma početka!',
      );
    }

    const season = this.sezonaRepository.create({
      pocetak: startDate,
      kraj: endDate,
    });

    return await this.sezonaRepository.save(season);
  }

  async getSeasons(queryDto: SezoneQueryDto) {
    const { pocetak, kraj, page = 1 } = queryDto;

    const perPage = 6;
    const skip = (page - 1) * perPage;
    const now = new Date();

    const qb = this.sezonaRepository.createQueryBuilder('sezona');

    if (pocetak) {
      qb.andWhere('sezona.pocetak >= :pocetak', { pocetak });
    }

    if (kraj) {
      qb.andWhere('sezona.kraj <= :kraj', { kraj });
    }

    qb.orderBy('sezona.pocetak', 'DESC');

    const [seasons, total] = await qb
      .skip(skip)
      .take(perPage)
      .getManyAndCount();

    const data = seasons.map((sezona) => {
      let status = 'nepoznato';
      const datumPocetka = new Date(sezona.pocetak);
      const datumKraja = new Date(sezona.kraj);

      if (now < datumPocetka) {
        status = 'uskoro';
      } else if (now >= datumPocetka && now <= datumKraja) {
        status = 'u toku';
      } else {
        status = 'završena';
      }

      return {
        ...sezona,
        pocetak: formatDate(sezona.pocetak),
        kraj: formatDate(sezona.kraj),
        status,
      };
    });

    console.log(data);

    return {
      success: true,
      message: 'Lista sezona uspešno učitana.',
      data,
      meta: {
        total,
        per_page: perPage,
        current_page: page,
        last_page: Math.ceil(total / perPage),
      },
    };
  }
}
