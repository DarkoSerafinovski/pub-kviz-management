export class OnboardingDto {
  userId: string;
  role: 'moderator' | 'team' | 'guest';
  username: string;
  logoUrl?: string;
}
