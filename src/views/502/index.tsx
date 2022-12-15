import React from 'react';
import Actions from '_c/actions';
import role from '@/assets/svg/502.svg';
import './index.less'

export default function NotAuth() {
  return (
    <div className='role'>
      <div className='text'>无权限访问！</div>
      <img src={role} alt="暂无权限访问" />
      <Actions />
    </div>
  )
}
