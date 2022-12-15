import React from 'react';
import { Space, Button, Popconfirm } from 'antd'
import type { List } from './index';

interface Props extends List {
  onDel: (id: number) => void;
  onShow: (id: number) => void;
  onEdit: (id: number) => void
};
export default function ListItem(props: Props) {
  const { imgUrl, status, create_time, id, onDel, onShow, onEdit } = props;
  return (
    <div className='list-item'>
      <div className='info'>
        <div className='goods-image'>
          <img src={imgUrl} alt="" />
        </div>
        <div className='goods-status goods-down'>
          {
            status
          }
        </div>
        <div className='goods-time'>
          {
            create_time
          }
        </div>
      </div>
      <div className='actions'>
        <Space>
          <Button type='link' onClick={() => onShow(id)}>上架</Button>
          <Button type='link' onClick={() => onEdit(id)}>编辑</Button>
          <Popconfirm title="是否确认删除？" onConfirm={() => onDel(id)} cancelText="取消" okText="确定"><Button type='link'>删除</Button></Popconfirm>
        </Space>
      </div>
    </div>
  )
}
