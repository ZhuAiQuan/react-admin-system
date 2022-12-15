import { useState, useMemo } from 'react';
import { Segmented, Button, message } from 'antd';
import ListItem from './List';
import { useNavigate } from 'react-router-dom'
import './index.less';

const status = [
  {
    label: <>全部</>,
    value: 'all'
  },
  {
    label: <>展示中</>,
    value: 'show'
  },
  {
    label: <>已下架</>,
    value: 'down'
  }
]
export type List = {
  imgUrl: string;
  status: string;
  create_time: string;
  id: number
}
export default function Banner() {
  const location = useNavigate();
  const [segValue, changeSegVal] = useState('all');
  const [list, setList] = useState<List[]>([
    {
      imgUrl: '',
      status: 'show',
      create_time: '2022-07-25 10:44:55',
      id: 1
    }
  ]);

  function onChange(val: string | number) {
    changeSegVal(val as string);
  }
  function onAdd(id = 0) {
    const type = id ? `${id}` : 'add';
    location(`/content-management/banner-edit/${type}`)
  };
  function onDel(id: number) {
    if (list.length < 2) {
      message.warning('至少保留一张轮播图！')
    } else {
      // request
    }
  }
  // 上下架
  function onShow(id: number) {};

  return (
    <div className='banner-context'>
      <div className='status'>
        <Segmented options={status} onChange={onChange} value={segValue} />
        <Button type='primary' onClick={() => onAdd()}>新建</Button>
      </div>
      <div className='context'>
        {
          list.map(item => useMemo(() => <ListItem {...item} key={item.id} onDel={onDel} onShow={onShow} onEdit={onAdd} />, [item]))
        }
      </div>
    </div>
  )
}
