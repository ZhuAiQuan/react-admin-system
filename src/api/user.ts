import axios from 'utils/index';

export const login = (username: string, password: string) => {
  return axios.request({
    url: '/api/admin/user/login',
    method: 'post',
    data: {
      password,
      username
    }
  })
}

export const loginOut = () => {
  return axios.request({
    url: '/api/admin/user/logout',
    method: 'post'
  })
}