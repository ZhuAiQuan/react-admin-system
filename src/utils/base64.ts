import { Base64 } from 'js-base64';

export const encode = (data: string) => {
  return Base64.encode(data)
}

export const decode = (base: string) => {
  return Base64.decode(base)
}