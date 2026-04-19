import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/users/entities/profile.entity';
import { Repository } from 'typeorm';
import { OnboardingDto } from './dto/onboarding.dto';
import { Tim } from 'src/teams/entities/team.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(Tim)
    private readonly teamRepo: Repository<Tim>,
  ) {}

  async onboarding(dto: OnboardingDto) {
    let profile = await this.profileRepo.findOne({
      where: { id: dto.userId },
    });

    if (!profile) {
      profile = await this.profileRepo.save({
        id: dto.userId,
        username: dto.username,
        role: dto.role,
      });
    }

    if (dto.role === 'team') {
      await this.teamRepo.save({
        naziv: dto.username,
        logo: dto.logoUrl,
        profile,
      });
    }

    return { success: true };
  }

  async getMe(userId: string) {
    return this.profileRepo.findOne({
      where: { id: userId },
      relations: ['team'],
    });
  }
}
