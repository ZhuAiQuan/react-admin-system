import { matchRoutes, useLocation, Navigate } from "react-router-dom";
import { Fragment, ReactNode, useMemo } from "react";
import routes from "./config";
import { getToken } from "@/utils/cookies";
import { useAppSelector as useSelector, useAppDispatch as useDispatch } from "@/store/hook";
import useFormatRoute from "@/utils/asyncRoute";
import { getBreadCrumb } from "@/store/slice/user";
import { changeLocal } from '@/store/slice/global'
import { Router } from "@/types/router";

const whiteList = ["/register", "/404"];
const notChangeLocalList = ['/home', '/goods/edit'];
const RouterPremission = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { roleRoute, breadCrumb } = useSelector((state) => state.user);
  const { showLocal } = useSelector(state => state.global)
  // 获取后台传过来的权限路由
  const backRoutes: Router.backRouter[] = useMemo(() => roleRoute, [roleRoute]);

  const token = getToken();
  // 检测权限路由
  const { checkAuthRouter } = useFormatRoute();
  const location = useLocation();
  // // 匹配当前层级路由树
  const matchs = matchRoutes(routes, location);
  if (!token) {
    // 没有token 且不在白名单里 重定向到登录页面
    if (
      !whiteList.includes(location.pathname) &&
      location.pathname !== "/login"
    )
      return <Navigate to="/login" />;
  } else {
    // 白名单以及首页都能访问 并且匹配不到的路由也可以去404
    if (
      !["/", "/home", "/login"].concat(whiteList).includes(location.pathname) &&
      !matchs?.some((item) => item.route.path === "*")
    ) {
      // 登录后如果内存中没有权限路由则从session中获取
      if (!backRoutes.length) {
        // 直接退出清除权限 清除cookie等
        sessionStorage.clear();
        return <Navigate to="/login" />;
      } else {
        // 有token 匹配当前路由是否存在于后台权限中 无则重定向到502
        if (
          !checkAuthRouter(backRoutes, location.pathname) &&
          location.pathname !== "/502"
        ) {
          return <Navigate to={"/502"} />;
        }
      }
    }
    // location.pathname
    const state = notChangeLocalList.some(path => location.pathname.includes(path));
    if (state) {
      if (showLocal) {
        setTimeout(() => {
          dispatch(changeLocal(false))
        }, 0);
      }
      
    } else {
      if (!showLocal) {
        setTimeout(() => {
          dispatch(changeLocal(true))
        }, 0);
      }
      
    }
    // 存储路由单元信息
    if (Array.isArray(matchs)) {
      let title = '';
      const temp = matchs
        .map((item) => {
          if (item.pathname === '/goods/edit/add' && item.route.path === 'edit/:id') {
            title = '新建商品信息'
          }
          return item.route
        })
        .filter((item: Router.CustomRouteObj) => item.meta && item.meta.title)
        .map((item: Partial<Router.CustomRouteObj>) => {
          return {
            path: item.path as string,
            title: title ? title : (item.meta as Router.MetaInfo).title,
          }
        });
      if (
        (!breadCrumb.at(-1) && temp.length) ||
        (temp.length && breadCrumb.at(-1).title !== temp[temp.length - 1].title)
      )
        setTimeout(() => {
          dispatch(getBreadCrumb(temp));
        }, 0);
    }
  }

  return <Fragment>{children}</Fragment>;
};

export default RouterPremission;
