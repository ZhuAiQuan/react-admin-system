import React, { useMemo, ReactNode, useState, useLayoutEffect, useContext } from "react";
import { useAppSelector } from "@/store/hook";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from 'react-router-dom'
import { Router } from "@/types/router";

interface MenuItems {
  label: string;
  key: string;
  children?: MenuItems[];
  disabled?: boolean;
  icon?: ReactNode;
}

export default function MenuContext() {
  const { roleRoute } = useAppSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [defaultSelectedKeys] = useState(["/"]);
  const [selectedKeys, setSelectedKeys] = useState(['/']);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // 首页
  const homePage = [
    {
      label: "首页",
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
    () => homePage.concat(formatItem(roleRoute)),
    [roleRoute]
  );
  const onClick: MenuProps["onClick"] = (e) => {
    const { pathname } = location;
    const { key, keyPath } = e;
    if (pathname === key) return
    
    let openKey = '';
    if (keyPath.length && keyPath[1]) {
      openKey = (keyPath.at(-1)) as string;
    }
    setOpenKeys(() => {
      // 展开的subMenu缓存
      sessionStorage.setItem('openKey', openKey)
      return [openKey]
    })
    
    // 选中的key 
    setSelectedKeys(() => [key]);
    // 缓存
    sessionStorage.setItem('selectedKey', key);
    // 导航到目标页
    navigate(key);
    
  };

  useLayoutEffect(() => {
    
    const openKey = sessionStorage.getItem("openKey");
    if (typeof openKey === 'string' && openKey) {
      setOpenKeys(() => [openKey])
    }
    const selectKey = sessionStorage.getItem('selectedKey');
    if (typeof selectKey === 'string') {
      setSelectedKeys(() => [selectKey])
    }
  }, []);

  return (
    <div className="menu-list">
      <Menu
        items={items}
        mode="inline"
        onClick={onClick}
        theme="dark"
        forceSubMenuRender={false}
        defaultSelectedKeys={defaultSelectedKeys}
        selectedKeys={selectedKeys}
        onOpenChange={(e) => setOpenKeys(() => [e.at(-1) as string])}
        openKeys={openKeys}
      />
    </div>
  );
}
