import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient<any>;
  private supabaseAdmin: SupabaseClient<any>;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_KEY');
    const serviceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!url || !key || !serviceRoleKey) {
      throw new Error('Nedostaju Supabase environment promenljive!');
    }

    const options = {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    };

    this.supabase = createClient(
      url,
      key,
      options,
    ) as any as SupabaseClient<any>;

    this.supabaseAdmin = createClient(
      url,
      serviceRoleKey,
      options,
    ) as any as SupabaseClient<any>;
  }

  get client(): SupabaseClient<any> {
    return this.supabase;
  }

  get adminClient(): SupabaseClient<any> {
    return this.supabaseAdmin;
  }
}
