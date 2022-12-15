import Cookies from 'js-cookie';
import { expires } from '@/config';
import { encode, decode } from '@/utils/base64'

const token = 'TOKEN'
const userInfo = 'USERINFO'
export const setToken = (value: string) => {
  if (value) {
    Cookies.set(token, encode(value), {
      expires
    })
  }
  
}

export const getToken = () => {
  return typeof Cookies.get(token) === 'string' ? decode(Cookies.get(token) as string) : false
}

export const setUserInfo = (value: string) => {
  Cookies.set(userInfo, value, {
    expires
  })
}

export const getUserInfo = () => {
  const str = Cookies.get(userInfo);
  if (str) {
    return JSON.parse(str)
  } else return false
}

export const clearCookies = () => {
  // 清除全部cookies
  document.cookie.split('; ').forEach(item => {
    const key = item.split('=')[0];
    Cookies.remove(key)
  })
}