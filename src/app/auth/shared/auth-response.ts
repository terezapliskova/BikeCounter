import { User } from '../../users/shared/user';

export interface AuthResponse {
  token: string;
  user: User;
}
