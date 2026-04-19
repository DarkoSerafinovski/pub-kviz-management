import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'moderator' | 'team' | 'guest';
  created_at: string;
}

export interface AuthenticatedRequest extends Request {
  user: UserProfile;
}

@Injectable()
export class SupabaseGuard implements CanActivate {
  constructor(private readonly supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Nedostaje token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token nije validan');
    }

    const { data, error: authError } =
      await this.supabase.client.auth.getUser(token);

    if (authError || !data?.user) {
      throw new UnauthorizedException('Token je istekao ili je nevažeći');
    }

    const { data: profile, error: profileError } =
      await this.supabase.adminClient
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

    if (profileError || !profile) {
      throw new UnauthorizedException('Profil ne postoji');
    }

    if (!data.user.email) {
      throw new UnauthorizedException('Email ne postoji u tokenu');
    }

    request.user = {
      id: profile.id,
      username: profile.username,
      role: profile.role,
      created_at: data.user.created_at,
      email: data.user.email,
    };

    return true;
  }
}
