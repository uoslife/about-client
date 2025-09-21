import { isMobile } from '@/shared/utils/isMoblie';
import {
  AmplitudePropertyType,
  DeviceType,
  MemberRole,
} from '../AmplitudePropertyType';
import { MyInfoResponseRole } from '@uoslife/api';
import { match } from 'ts-pattern';

const getDeviceType = (): DeviceType => {
  return isMobile() ? 'mobile' : 'pc';
};

const getUserRole = (role: MyInfoResponseRole): MemberRole => {
  return match<MyInfoResponseRole, MemberRole>(role)
    .with('GUEST', () => 'guest')
    .with('ASSOCIATE_MEMBER', () => 'associate_member')
    .with('FULL_MEMBER', () => 'full_member')
    .with('ADMIN', () => 'admin')
    .exhaustive();
};

export const makeBaseProperty = (
  role: MyInfoResponseRole,
): Partial<AmplitudePropertyType> => {
  return {
    device: getDeviceType(),
    member_role: getUserRole(role),
  };
};
