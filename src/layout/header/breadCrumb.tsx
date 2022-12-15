import React from 'react';
import { Breadcrumb  } from 'antd';
import { useAppSelector as useSelector } from '@/store/hook';
// import { Link } from 'react-router-dom'

export default function BreadCrumb() {
  const { breadCrumb } = useSelector(state => state.user);

  return (
    <Breadcrumb>
      {
        breadCrumb.map((item: Store.BreadCrumb) => <Breadcrumb.Item key={item.path}>{item.title}</Breadcrumb.Item>)
      }
    </Breadcrumb>
  )
}
