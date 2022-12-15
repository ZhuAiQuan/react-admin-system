import { useState, useEffect, useRef } from 'react';
import Show from './Show';
import Images from './Images';
import Jump from './Jump';
import { Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.less'

export interface Info {
  show: boolean;
  imgUrl: string;
  title: string;
  subTitle: string;
  type: keyof typeof jump;
  custom?: string;
  link?: string;
  detail?: string;
}
const jump = {
  custom: '自定义内容',
  link: '第三方链接',
  detail: '商品详情页'
}
export type JumpOptions = typeof jump;
const radio = [
  {
    value: true,
    label: '立即上架'
  },
  {
    value: false,
    label: '暂不上架'
  }
]
export type RadioOptions = typeof radio;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
export type FormItemLayout = typeof formItemLayout;

export default function index() {
  const location = useNavigate();
  const [info, setInfo] = useState<Info>({
    show: true,
    imgUrl: 'https://desk-fd.zol-img.com.cn/t_s960x600c5/g7/M00/06/02/ChMkK2JU2GSIalsMABRnN4xk09QAACYlQKOso4AFGdP781.jpg',
    title: '',
    subTitle: '',
    type: 'custom'
  });
  const [scrollVal, setVal] = useState(0);
  const [down, updateState] = useState(false);
  const [offsetWidth, setWidth] = useState(0);
  const ctx = useRef<HTMLDivElement | null>(null);

  // 监听是否向下滚动
  function onScroll(e: Event) {
    if (e.target instanceof HTMLDivElement) {
      updateState(scrollVal - e.target.scrollTop < 0);
      setVal(e.target.scrollTop);
    }
  }

  function onSubmit() {
    // 
  }
  useEffect(() => {
    const current = ctx.current as HTMLDivElement;
    current.addEventListener('scroll', onScroll);
    setWidth(current.offsetWidth);
    return () => {
      current.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className='banner-setting' ref={ctx}>
      <Images imgUrl={info.imgUrl} title={info.title} subTitle={info.subTitle} onChange={setInfo} formItemLayout={formItemLayout} />
      <Jump type={info.type} onChange={(key: keyof Info, val: string) => setInfo({...info, [key]: val})} jump={jump} formItemLayout={formItemLayout} />
      <Show show={info.show} onChange={(show: boolean) => setInfo(data => ({...data, show}))} options={radio} formItemLayout={formItemLayout} />
      {
        down && <div className='footer' style={{width: `${offsetWidth}px`}}>
        <Space>
          <Button onClick={() => location(-1)}>取消</Button>
          <Button type='primary' onClick={onSubmit}>保存</Button>
        </Space>
      </div>
      }
      
    </div>
  )
}
