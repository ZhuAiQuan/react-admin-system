import { Router } from "@/types/router";

/**
 *
 * @param arr 权限路由
 * @param url 目标路由
 * @returns 返回权限路由中是否包含目标路由
 */
const checkAuthRouter = (arr: Router.backRouter[], url: string) => {
  return arr.some((item) => {
    if (item.childrenMenu && checkAuthRouter(item.childrenMenu, url)) {
      return true;
    }
    return item.url === url || checkRouterParms(item.url, url);
  });
};
/**
 * 判断动态路由 携带的参数 支持动态路由的值和查询路由字符串的值
 * @param path 比较路由path
 * @param url 目标路由path
 */
const checkRouterParms = (path: string, url: string) => {
  const firstPath = path.split("/");
  const lastPath = url.split("/");
  if (firstPath.length === lastPath.length) {
    if (path.includes("/:")) {
      let _i = 0;
      for (let i = 0; i < firstPath.length; i++) {
        if (firstPath[i].includes(":")) {
          _i = i;
          break;
        }
      }
      // 判断:前面的字符串是否相等
      return (
        firstPath.slice(0, _i).toString() === lastPath.slice(0, _i).toString()
      );
    } else if (path.includes("?")) {
      const len = path.indexOf('?');
      return path.substring(0, len) === url.substring(0, len)
    }
  }
  return false;
};
/**
 * 
 * @returns 过滤掉含有动态路由值的路由
 */
const filterRouteParms = (list: Router.backRouter[]) => {
  return list.filter(item => {
    if (item.childrenMenu && item.childrenMenu.length && !item.url.includes('/:')) item.childrenMenu = filterRouteParms(item.childrenMenu)
    return !item.url.includes('/:')
  })
}

export default function useFormatRoute() {
  return {
    checkAuthRouter,
    filterRouteParms,
  };
}
