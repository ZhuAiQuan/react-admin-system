import Request from './http.reqeuest';

const axios = new Request(import.meta.env.MODE === 'development' ? '/api' : import.meta.env.VITE_BASE_URL);

export default axios;