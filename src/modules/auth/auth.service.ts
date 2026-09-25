import { getAuth } from 'firebase-admin/auth';
import { HttpError } from '../../common/errors/http.error';
import { comparePassword } from '../../common/functions/bcrypt.functions';
import { userService } from '../user/user.service';
import { CreateEnterpriseDto } from './dto/createEnterprise.dto';
import { EmployeeLoginDto } from './dto/employeeLogin.dto';
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

  async employeeLogin(dto: EmployeeLoginDto, restaurantId: string) {
    const user = await userService.findByNameAndRestaurant(dto.name, restaurantId);
    if (!user) {
      throw new HttpError(404, 'Funcionário não encontrado');
    }

    const match = await comparePassword(dto.password, user.password);
    if (!match) {
      throw new HttpError(401, 'Senha incorreta');
    }

    return userService.sanitize(user);
  }
}

export const authService = new AuthService();
