import { getToken } from '@/utils/cookies';

const isLogin = getToken();
debugger

export default function useAuth() {
  return {
    isLogin
  }
}