import { getAuth } from 'firebase-admin/auth';
import { HttpError } from '../../common/errors/http.error';
import { CreateEnterpriseDto } from './dto/createEnterprise.dto';
import { LoginRestaurantDto } from './dto/loginRestaurant.dto';

export class AuthService {
  async createUser(dto: CreateEnterpriseDto) {
    const { email, password } = dto;

    const userRecord = await getAuth().createUser({ email, password });
    await getAuth().setCustomUserClaims(userRecord.uid, {
      id: userRecord.uid,
    });

    return userRecord;
  }

  async login(dto: LoginRestaurantDto) {
    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!apiKey) {
      throw new HttpError(500, 'FIREBASE_WEB_API_KEY is not set');
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: dto.email,
          password: dto.password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new HttpError(401, data.error?.message ?? 'Invalid credentials');
    }

    return data.idToken as string;
  }
}

export const authService = new AuthService();