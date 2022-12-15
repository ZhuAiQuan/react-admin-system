import { RouteObject, Navigate } from 'react-router-dom';
import { Spin } from "antd";
import { Suspense, lazy, LazyExoticComponent } from "react";
import Main from '@/layout/Main';
import { Router } from '@/types/router';

export function lazyload(Com: LazyExoticComponent<any>) {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></Spin>
      }
    >
      <Com />
    </Suspense>
  );
}

const routes: Router.CustomRouteObj[] = [
  {
    path: '/',
    element: <Main />,
    children: [
      {
        index: true,
        element: <Navigate to='/home' />
      },
      {
        path: 'home',
        meta: {
          title: '首页'
        },
        element: lazyload(lazy(() => import('views/home')))
      },
      {
        path: 'setting',
        meta: {
          title: '设置'
        },
        children: [
          {
            index: true,
            element: <Navigate to="/setting/role" />
          },
          {
            path: 'role',
            meta: {
              title: '权限管理'
            },
            element: lazyload(lazy(() => import("views/setting/role")))
          },
          {
            path: 'user',
            meta: {
              title: '用户管理'
            },
            element: lazyload(lazy(() => import("views/setting/user")))
          },
          {
            path: 'router',
            meta: {
              title: '菜单管理'
            },
            element: lazyload(lazy(() => import("views/setting/router")))
          }
        ]
      },
      {
        path: 'content-management',
        meta: {
          title: '内容管理'
        },
        children: [
          {
            index: true,
            element: <Navigate to={'/content-management/banner'} />
          },
          {
            path: 'banner',
            meta: {
              title: '轮播图'
            },
            element: lazyload(lazy(() => import("views/content/banner")))
          },
          {
            path: 'banner-edit/:id',
            meta: {
              title: '更新轮播图'
            },
            element: lazyload(lazy(() => import("views/content/banner/edit")))
          },
          {
            path: 'videos',
            meta: {
              title: '视频管理'
            },
            element: lazyload(lazy(() => import("views/content/videos")))
          },
          {
            path: 'goods',
            meta: {
              title: '产品系列'
            },
            element: lazyload(lazy(() => import("views/content/goods")))
          },
          {
            path: 'news',
            meta: {
              title: '新闻资讯'
            },
            element: lazyload(lazy(() => import("views/content/news")))
          }
        ]
      },
      {
        path: 'channel',
        meta: {
          title: '渠道管理'
        },
        children: [
          {
            index: true,
            element: <Navigate to={'/channel/list'} />
          },
          {
            path: 'list',
            meta: {
              title: '渠道列表'
            },
            element: lazyload(lazy(() => import('views/channel/list')))
          }
        ]
      },
      {
        path: 'goods',
        meta: {
          title: '商品管理'
        },
        children: [
          {
            index: true,
            element: <Navigate to={'/goods/list'} />
          },
          {
            path: 'list',
            meta: {
              title: '商品列表'
            },
            element: lazyload(lazy(() => import("views/goods/list")))
          },
          {
            path: 'category',
            meta: {
              title: '商品分类'
            },
            element: lazyload(lazy(() => import('views/goods/category')))
          },
          {
            path: 'edit/:id',
            meta: {
              title: '编辑商品信息',
              hide: true
            },
            element: lazyload(lazy(() => import('views/goods/edit')))
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: lazyload(lazy(() => import('views/login')))
  },
  {
    path: '/502',
    element: lazyload(lazy(() => import("views/502")))
  },
  {
    path: '*',
    element: lazyload(lazy(() => import("views/404")))
  }
]

export default routes