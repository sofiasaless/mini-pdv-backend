import { getAuth } from 'firebase-admin/auth';
import { CreateEnterpriseDto } from './dto/createEnterprise.dto';

export class AuthService {
  async createUser(dto: CreateEnterpriseDto) {
    const { email, password } = dto;

    const userRecord = await getAuth().createUser({ email, password });
    await getAuth().setCustomUserClaims(userRecord.uid, {
      id: userRecord.uid,
    });

    return userRecord;
  }
}

export const authService = new AuthService();