/*
 * @Description: xingp，yyds
 * @Author: zaq
 * @Date: 2021-06-30 14:03:21
 * @LastEditTime: 2021-07-08 15:01:55
 * @LastEditors: zaq
 * @Reference:
 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosPromise,
} from "axios";
import { getToken, clearCookies } from "utils/cookies";
import { message } from "antd";

const notAuthStatus = [1001, 1002, 1003];
type Queue = {
  [key: string]: boolean;
};
type Method = "post" | "get";
interface Config {
  url: string;
  method: Method;
  data?: unknown;
  params?: unknown;
  headers?: Headers;
}
interface Headers {
  [prop: string]: string;
}
interface AxiosRequestCofigExtends extends AxiosRequestConfig {
  requestKey?: string;
}

const timeout = 10 * 1000;
const pendingRequests: Map<string, any> = new Map(); // 拦截重复请求

class Request {
  private baseURL: string;
  private queue: Queue;
  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.queue = {};
  }
  getConfig() {
    return {
      baseURL: this.baseURL,
      timeout,
      headers: {
        //
      },
    };
  }
  destroy(url: string) {
    delete this.queue[url];
  }
  interceptors(instance: AxiosInstance, url: string) {
    instance.interceptors.request.use(
      (config: AxiosRequestCofigExtends) => {
        if (getToken()) {
          (config.headers as AxiosRequestHeaders)[
            "Authorization"
          ] = `Bearer ${getToken()}`;
        }
        // 重复请求拦截判断
        const requestKey = `${config.url}/${JSON.stringify(
          config.params
        )}/${JSON.stringify(config.data)}&request_type=${
          config.method
        }/${JSON.stringify(config.headers)}`; // map key值
        if (pendingRequests.has(requestKey)) {
          config.cancelToken = new axios.CancelToken((cancel) => {
            // cancel 函数的参数会作为 promise 的 error 被捕获
            cancel(`重复的请求被主动拦截: ${requestKey}`);
          });
        } else {
          pendingRequests.set(requestKey, config);
          config.requestKey = requestKey;
        }
        this.queue[url] = true;
        return config;
      },
      (error: unknown) => {
        // 这里出现错误可能是网络波动造成的，清空 pendingRequests 对象
        pendingRequests.clear();
        message.error('网络错误!');
        return Promise.reject(error);
      }
    );
    instance.interceptors.response.use(
      (res) => {
        const requestKey = (res.config as any).requestKey;
        pendingRequests.delete(requestKey);
        this.destroy(url);
        if (notAuthStatus.includes(+res.data.code)) {
          message.loading(res.data.msg, 2).then(() => {
            // 清空cookies
            clearCookies();
            sessionStorage.clear();
            localStorage.clear();
            location.replace("/login");
          });
        }
        return res;
      },
      (error) => {
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }
        pendingRequests.clear();
        message.error(error.msg || '请求失败！');
        return Promise.reject(error);
      }
    );
  }
  request(config: Config): AxiosPromise<Request.Response> {
    const instance = axios.create();
    const option = Object.assign(this.getConfig(), config);
    this.interceptors(instance, config.url);
    return instance(option);
  }
}

export default Request;
