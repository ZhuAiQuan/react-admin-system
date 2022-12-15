import React, { useLayoutEffect } from "react";
import { Button } from "antd";
import { setToken } from "@/utils/cookies";
import { useNavigate, RouteObject } from "react-router-dom";
import useFormatRoute from "@/utils/asyncRoute";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { addRoleRoutes, getLeftSideRoutes } from "@/store/slice/user";
import { encode } from "@/utils/base64";
import LoginForm from "./login";
import { getActivityList, userLogin } from "@/store/slice/user";
import "./index.less";

export type LoginData = {
  username: string;
  password: string;
};
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { filterRouteParms } = useFormatRoute();
  const onLogin = (data: LoginData) => {
    dispatch(userLogin(data)).then((res) => {
      if (res.payload) {
        const roleRouter = [
          // {
          //   url: "content-management",
          //   name: "内容管理",
          //   childrenMenu: [
          //     {
          //       url: "/content-management/banner",
          //       name: "轮播图",
          //     },
          //     {
          //       url: "/content-management/banner-edit/:id",
          //       name: "更新轮播图",
          //     },
          //     {
          //       url: "/content-management/videos",
          //       name: "视频管理",
          //     },
          //     {
          //       url: "/content-management/goods",
          //       name: "产品系列",
          //     },
          //     {
          //       url: "/content-management/news",
          //       name: "新闻资讯",
          //     },
          //   ],
          // },
          // {
          //   url: "channel",
          //   name: "渠道管理",
          //   childrenMenu: [
          //     {
          //       url: "/channel/list",
          //       name: "渠道列表",
          //     },
          //   ],
          // },
          {
            url: "goods",
            name: "商品管理",
            childrenMenu: [
              {
                url: "/goods/list",
                name: "商品列表",
              },
              {
                url: "/goods/category",
                name: "商品分类",
              },
              {
                url: "/goods/edit/:id",
                name: "编辑商品信息",
              },
            ],
          },
          // {
          //   url: "setting",
          //   name: "设置",
          //   childrenMenu: [
          //     {
          //       url: "/setting/role",
          //       name: "权限",
          //     },
          //   ],
          // },
        ];
        const leftSide = filterRouteParms(
          JSON.parse(JSON.stringify(roleRouter))
        );
        localStorage.setItem("left-side", encode(JSON.stringify(leftSide)));
        localStorage.setItem("routes", encode(JSON.stringify(roleRouter)));
        // 权限路由
        dispatch(addRoleRoutes(roleRouter));
        // 左侧菜单栏过滤后的路由
        dispatch(getLeftSideRoutes(leftSide));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    });
  };

  return (
    <div className="login">
      <div className="form-container">
        <div className="login-ctx">
          <div className="title"></div>
          <div className="form-ctx">
            <LoginForm onSuccess={onLogin} />
          </div>
        </div>
        {/* <div className='copy-right'>copyright© {new Date().getFullYear()}</div> */}
      </div>
      {/* <div id='stars'></div>
      <div id='stars2'></div>
      <div id='stars3'></div> */}
      {/* <div className='card'>
        <div className='title'>ncc数据处理后台管理系统</div>
        <LoginForm onSuccess={onLogin}></LoginForm>
      </div> */}
    </div>
  );
}
