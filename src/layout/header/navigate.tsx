import React, { useMemo, ReactNode, useState, useLayoutEffect } from "react";
import { Menu } from "antd";
import { useAppSelector } from "@/store/hook";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { Router } from "@/types/router";
import { ReactSVG } from 'react-svg';
import homeSvg from '@/assets/svg/menu/home.svg';
import goodSvg from '@/assets/svg/menu/goods.svg'

interface MenuItems {
  label: string;
  key: string;
  children?: MenuItems[];
  disabled?: boolean;
  icon?: ReactNode;
}

export default function NavigateBar() {
  const { leftSideRoute } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultSelectedKeys] = useState(["/"]);
  const [selectedKeys, setSelectedKeys] = useState(["/"]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 首页
  const homePage = [
    {
      // @ts-ignore
      label: <a href="/" onClick={stopEvent}>首页</a>,
      key: "/",
    },
  ];
  const formatItem = (list: Router.backRouter[]) => {
    return list.map((item) => {
      const obj: MenuItems = {
        label: item.name,
        key: item.url,
      };
      if (item.childrenMenu) {
        obj.children = formatItem(item.childrenMenu);
      }
      return obj;
    });
  };
  const items = useMemo(
    () => {
      // @ts-ignore
      const temp = addOption(homePage.concat(formatItem(leftSideRoute)));
      return temp
    },
    [leftSideRoute]
  );
  const onClick: MenuProps["onClick"] = (e) => {
    const { pathname } = location;
    const { key, keyPath } = e;
    if (pathname === key) return;

    let openKey = "";
    if (keyPath.length && keyPath[1]) {
      openKey = keyPath.at(-1) as string;
    }
    setOpenKeys(() => {
      // 展开的subMenu缓存
      localStorage.setItem("openKey", openKey);
      return [openKey];
    });

    // 选中的key
    setSelectedKeys(() => [key]);
    // 缓存
    localStorage.setItem("selectedKey", key);
    // 导航到目标页
    navigate(key);
  };
  function addOption(list: MenuItems[]) {
    return list.map(item => {
      if (item.key) {
        if (item.key === '/') item.icon = (<ReactSVG className="menu-icons" src={homeSvg}></ReactSVG>)
        else item.icon = (<ReactSVG className="menu-icons" src={goodSvg} />)
      }
      // 非得要浏览器自带的打开新窗口 那只好给他全部a标签自己去右键打开了
      if (item.children) {
        // @ts-ignore
        item.children = item.children.map(row => {
          // @ts-ignore
          row.label = <a href={row.key} onClick={stopEvent}>{row.label}</a>;
          return {
            ...row
          }
        })
      }
      return {
        ...item
      }
    })
  }
  // 组织a默认跳转事件
  function stopEvent(e: Event) {
    e.preventDefault();
  }

  useLayoutEffect(() => {
    const temp = location.pathname.split('/').filter(item => item);
    if (temp.length > 1) {
      setOpenKeys([temp[0]]);
      setSelectedKeys([location.pathname])
    } else {
      setOpenKeys([]);
      // 这里要判断下 并非只有Home页面是一级的 后面也许还有别的一级页面
      setSelectedKeys(['/'])
    }
    // const openKey = localStorage.getItem("openKey");
    // if (typeof openKey === "string" && openKey) {
    //   setOpenKeys(() => [openKey]);
    // }
    // const selectKey = localStorage.getItem("selectedKey");
    
    // if (typeof selectKey === "string") {
    //   setSelectedKeys(() => [selectKey]);
    // }
  }, []);
  return (
    <Menu
      mode="inline"
      items={items}
      onClick={onClick}
      forceSubMenuRender={false}
      defaultSelectedKeys={defaultSelectedKeys}
      selectedKeys={selectedKeys}
      onOpenChange={(e) => setOpenKeys(() => [e.at(-1) as string])}
      openKeys={openKeys}
      className="navigate"
      theme="dark"
    ></Menu>
  );
}
