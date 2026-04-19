import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/users/entities/profile.entity';
import { Tim } from 'src/teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Tim])],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [TypeOrmModule],
})
export class AuthModule {}
