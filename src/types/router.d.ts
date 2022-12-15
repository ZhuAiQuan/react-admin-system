import type { RouteObject } from 'react-router-dom'
declare namespace Router {
  interface backRouter {
    name: string;
    url: string;
    childrenMenu?: backRouter[]
  }
  interface CustomRouteObj extends RouteObject {
    meta?: MetaInfo;
    children?: CustomRouteObj[]
  }
  interface MetaInfo {
    title: string;
    hide?: boolean
  }
}