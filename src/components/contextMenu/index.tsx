import React, { ReactNode } from 'react';
import { Dropdown, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom'

type Props = {
  children: ReactNode;
  url: string
}
export default function ContextMenu(props: Props) {
  const { children, url } = props;
  const location = useNavigate();
  const handleClick: MenuProps["onClick"] = ({key}) => {
    if (+key === 2) {
      location(url)
    } else if (+key === 1) {
      window.open(url)
    } else {
      window.open(url, '_blank', "menubar=no,scrollbars=yes,resizable=yes,status=yes,titlebar=yes,toolbar=yes,location=yes")
    }
  };

  const menu = (
    <Menu items={[
      {
        label: '在新窗口中打开链接',
        key: 0
      },
      {
        label: '在新标签中打开链接',
        key: 1
      },
      {
        label: '在本页面打开链接',
        key: 2
      }
    ]}
    onClick={handleClick}
    />
  )
  return (
    // <Dropdown trigger={['contextMenu']} overlay={menu}>
    //   {children}
    // </Dropdown>
    <a href={url}>{children}</a>
  )
}
