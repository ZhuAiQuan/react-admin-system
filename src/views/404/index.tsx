import React from 'react';
import notFound from '@/assets/svg/404.svg';
import Actions from '_c/actions'
import './index.less';

export default function NotFound() {
  return (
    <div className='not-found'>
      <div className='text'>oops~页面找不到了！</div>
      <img src={notFound} alt="" />
      <Actions />
    </div>
  )
}
