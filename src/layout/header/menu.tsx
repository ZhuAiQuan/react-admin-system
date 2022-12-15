import React from 'react';
import { Menu } from 'antd';
// import { useNavigate } from 'react-router-dom';
import { clearCookies } from 'utils/cookies';
import { loginOut } from 'api/user'

export default function MenuItem() {
  // const navigate = useNavigate();
  // debugger
  const items = [
    {
      key: '1',
      label: (
        <div onClick={onLogOut}>退出</div>
      )
    },
    // {
    //   key: '2',
    //   label: (
    //     <div>修改密码</div>
    //   )
    // }
  ]
  function onLogOut() {
    // 退出登录 清除全部数据
    loginOut().finally(() => {
      sessionStorage.clear();
      localStorage.clear();
      clearCookies();
      // navigate('/login')
      location.reload()
    })
    
  }
  return (
    <>
      <Menu items={items}></Menu>
    </>
  )
}
