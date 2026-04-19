import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDogadjajDto } from './dto/create-dogadjaj.dto';
import { DogadjajiQueryDto } from './dto/dogadjaji-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dogadjaj } from './entities/dogadjaj.entity';
import { Repository } from 'typeorm';
import { Sezona } from 'src/seasons/entities/sezona.entity';
import { Profile } from 'src/users/entities/profile.entity';
import { PrijavaTimaDto } from './dto/prijava-tima.dto';
import { DogadjajTim } from 'src/results/entities/dogadjaj-tim.entity';
import { Clan } from 'src/teams/entities/clan.entity';
import { ClanUcesce } from 'src/teams/entities/clan-ucesce.entity';
import { OmiljeniDogadjaj } from './entities/omiljeni-dogadjaji.entity';
import { Tim } from 'src/teams/entities/team.entity';
import { formatDate } from 'src/common/utils/date-util';

@Injectable()
export class DogadjajService {
  constructor(
    @InjectRepository(Sezona)
    private readonly seasonRepo: Repository<Sezona>,
    @InjectRepository(Dogadjaj)
    private readonly eventRepo: Repository<Dogadjaj>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(DogadjajTim)
    private readonly eventTeamRepo: Repository<DogadjajTim>,
    @InjectRepository(Clan)
    private readonly memberRepo: Repository<Clan>,
    @InjectRepository(ClanUcesce)
    private readonly participationRepo: Repository<ClanUcesce>,
    @InjectRepository(OmiljeniDogadjaj)
    private readonly favoritesRepo: Repository<OmiljeniDogadjaj>,
    @InjectRepository(Tim)
    private readonly teamRepo: Repository<Tim>,
  ) {}

  async create(dto: CreateDogadjajDto) {
    const sezona = await this.seasonRepo.findOne({
      where: { id: dto.sezona_id },
    });

    if (!sezona) {
      throw new NotFoundException(
        'Sezona u koju pokušavate da dodate događaj ne postoji.',
      );
    }

    const datumDogadjaja = new Date(dto.datum_odrzavanja);
    const pocetakSezone = new Date(sezona.pocetak);
    const krajSezone = new Date(sezona.kraj);

    if (datumDogadjaja < pocetakSezone || datumDogadjaja > krajSezone) {
      throw new BadRequestException(
        `Datum događaja mora biti u okviru trajanja sezone (${formatDate(sezona.pocetak)} do ${formatDate(sezona.kraj)}).`,
      );
    }

    const dogadjaj = this.eventRepo.create({
      naziv: dto.naziv,
      datum_odrzavanja: dto.datum_odrzavanja,
      sezona_id: dto.sezona_id,
    });

    const saved = await this.eventRepo.save(dogadjaj);

    return {
      success: true,
      message: 'Događaj je uspešno kreiran u okviru sezone.',
      data: saved,
    };
  }

  async findAll(queryDto: DogadjajiQueryDto, userId?: string) {
    const { sezona_id, omiljeni, naziv, datumOdrzavanja, page = 1 } = queryDto;

    const perPage = 5;
    const skip = (page - 1) * perPage;

    let foundTeamId: number | null = null;
    if (userId) {
      const profileWithTeam = await this.profileRepo.findOne({
        where: { id: userId },
        relations: ['team'],
      });
      foundTeamId = profileWithTeam?.team?.id || null;
    }

    const qb = this.eventRepo.createQueryBuilder('d');

    qb.loadRelationCountAndMap('d.broj_timova', 'd.rang_lista');

    if (userId) {
      qb.addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'fav_count')
          .from('omiljeni_dogadjaji', 'od')
          .where('od.dogadjaj_id = d.id')
          .andWhere('od.user_id = :userId');
      }, 'is_favorite');
    }

    if (foundTeamId) {
      qb.addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*)', 'reg_count')
          .from('dogadjaj_tim', 'dt_reg')
          .where('dt_reg.dogadjaj_id = d.id')
          .andWhere('dt_reg.tim_id = :foundTimId');
      }, 'is_registered');
    }

    qb.where('d.sezona_id = :sezona_id');

    if (naziv) {
      qb.andWhere('LOWER(d.naziv) LIKE LOWER(:naziv)');
    }

    if (datumOdrzavanja) {
      qb.andWhere('d.datum_odrzavanja = :datum');
    }

    if (String(omiljeni) === '1' && userId) {
      qb.innerJoin(
        'omiljeni_dogadjaji',
        'o',
        'o.dogadjaj_id = d.id AND o.user_id = :userId',
        { userId },
      );
    }

    qb.setParameters({
      sezona_id: Number(sezona_id),
      userId: userId || null,
      foundTimId: foundTeamId || null,
      naziv: `%${naziv}%`,
      datum: datumOdrzavanja,
    });
    qb.orderBy('d.datum_odrzavanja', 'ASC');
    qb.skip(skip).take(perPage);
    const { entities, raw } = await qb.getRawAndEntities();
    const total = await qb.getCount();

    const formattedData = entities.map((dogadjaj, index) => {
      const rawInfo = raw[index];

      return {
        ...dogadjaj,
        datum_odrzavanja_formatirano: formatDate(dogadjaj.datum_odrzavanja),

        broj_timova: parseInt(dogadjaj['broj_timova']) || 0,

        is_favorite: rawInfo.is_favorite
          ? parseInt(rawInfo.is_favorite) > 0
          : false,
        is_registered: rawInfo.is_registered
          ? parseInt(rawInfo.is_registered) > 0
          : false,
      };
    });

    return {
      success: true,
      message: 'Lista događaja uspešno učitana.',
      data: formattedData,
      meta: {
        total,
        per_page: perPage,
        current_page: Number(page),
        last_page: Math.ceil(total / perPage),
      },
    };
  }

  async prijavaTima(dto: PrijavaTimaDto, userId: string) {
    const { dogadjaj_id, clanovi } = dto;

    const profile = await this.profileRepo.findOne({
      where: { id: userId },
      relations: ['team'],
    });

    if (!profile?.team) {
      throw new ForbiddenException('Vaš nalog ne pripada nijednom timu.');
    }

    const tim = profile.team;

    const dogadjaj = await this.eventRepo.findOne({
      where: { id: dogadjaj_id },
    });

    if (!dogadjaj) {
      throw new NotFoundException('Događaj nije pronađen.');
    }

    if (new Date(dogadjaj.datum_odrzavanja) < new Date()) {
      throw new BadRequestException('Prijava nije moguća. Događaj je prošao.');
    }

    const vecPrijavljen = await this.eventTeamRepo.findOne({
      where: {
        dogadjaj_id,
        tim_id: tim.id,
      },
    });

    if (vecPrijavljen) {
      throw new BadRequestException(
        'Vaš tim je već prijavljen za ovaj događaj.',
      );
    }

    await this.eventTeamRepo.save({
      dogadjaj_id,
      tim_id: tim.id,
      score: 0,
    });

    for (const c of clanovi) {
      let clanId = c.id;

      if (!clanId) {
        const noviClan = await this.memberRepo.save({
          ime: c.ime,
          prezime: c.prezime,
        });

        clanId = noviClan.id;
      }

      await this.participationRepo.save({
        clan_id: clanId,
        dogadjaj_id,
        tim_id: tim.id,
      });
    }

    return {
      success: true,
      message: `Tim '${tim.naziv}' je uspešno prijavljen za događaj '${dogadjaj.naziv}'.`,
      data: {
        tim_id: tim.id,
        naziv: tim.naziv,
        dogadjaj: dogadjaj.naziv,
      },
    };
  }

  async toggleOmiljeniDogadjaj(userId: string, dogadjajId: number) {
    const dogadjaj = await this.eventRepo.findOne({
      where: { id: dogadjajId },
    });

    if (!dogadjaj) {
      throw new NotFoundException(
        'Događaj koji pokušavate da sačuvate ne postoji.',
      );
    }

    const postojeci = await this.favoritesRepo.findOne({
      where: {
        user_id: userId,
        dogadjaj_id: dogadjajId,
      },
    });

    if (postojeci) {
      await this.favoritesRepo.delete({
        user_id: userId,
        dogadjaj_id: dogadjajId,
      });

      return {
        success: true,
        is_favorite: false,
        message: `Događaj "${dogadjaj.naziv}" je uklonjen iz omiljenih.`,
      };
    }

    await this.favoritesRepo.insert({
      user_id: userId,
      dogadjaj_id: dogadjajId,
    });

    return {
      success: true,
      is_favorite: true,
      message: `Događaj "${dogadjaj.naziv}" je dodat u omiljene.`,
    };
  }

  async getClanoviUcesnici(dogadjajId: number, timId: number) {
    const tim = await this.teamRepo.findOne({
      where: { id: timId },
    });

    if (!tim) {
      throw new NotFoundException('Tim nije pronađen.');
    }

    const ucesca = await this.participationRepo.find({
      where: {
        dogadjaj: { id: dogadjajId },
        tim: { id: timId },
      },
      relations: ['clan'],
    });

    const clanovi = ucesca.map((u) => ({
      id: u.clan.id,
      ime: u.clan.ime,
      prezime: u.clan.prezime,
    }));

    return {
      success: true,
      message: 'Lista članova tima za izabrani događaj je uspešno učitana.',
      data: clanovi,
    };
  }

  async updateRoster(dogadjajId: number, dto: PrijavaTimaDto, userId: string) {
    const { clanovi } = dto;

    const tim = await this.teamRepo.findOne({
      where: { profile: { id: userId } },
    });

    if (!tim) {
      throw new ForbiddenException('Nalog ne pripada nijednom timu.');
    }

    const dogadjaj = await this.eventRepo.findOne({
      where: { id: dogadjajId },
    });

    if (!dogadjaj) {
      throw new NotFoundException('Događaj nije pronađen.');
    }

    const prijava = await this.eventTeamRepo.findOne({
      where: {
        dogadjaj: { id: dogadjajId },
        tim: { id: tim.id },
      },
    });

    if (!prijava) {
      throw new ForbiddenException(
        'Niste prijavljeni na ovaj događaj, pa ne možete menjati sastav.',
      );
    }

    if (new Date(dogadjaj.datum_odrzavanja) < new Date()) {
      throw new BadRequestException(
        'Izmena nije moguća jer je događaj u prošlosti.',
      );
    }

    await this.participationRepo.delete({
      tim: { id: tim.id },
      dogadjaj: { id: dogadjajId },
    });

    for (const c of clanovi) {
      let clanId = c.id;

      if (!clanId) {
        const noviClan = await this.memberRepo.save({
          ime: c.ime,
          prezime: c.prezime,
        });

        clanId = noviClan.id;
      }

      await this.participationRepo.save({
        clan: { id: clanId },
        tim: { id: tim.id },
        dogadjaj: { id: dogadjajId },
      });
    }

    return {
      success: true,
      message: 'Članovi tima uspešno ažurirani za izabrani događaj.',
      data: {
        tim: tim.naziv,
        dogadjaj: dogadjaj.naziv,
      },
    };
  }
}
