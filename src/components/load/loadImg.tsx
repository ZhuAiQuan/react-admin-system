import React, { useEffect, useState, useRef } from 'react';
import { getImgUrl } from 'api/uploads';
import { Spin, message } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import './index.less';

type Props = {
  goodsPicture: string
}
export default function LoadingImg(props: Props) {
  const { goodsPicture } = props;
  const [loading, changeState] = useState(true);
  const [src, getSrc] = useState('');
  const [err, changeErrState] = useState(false);
  const loadContext = useRef<HTMLDivElement | null>(null);

  const loadErr = (
    <div className='err-msg' onClick={getUrl}>
      <RedoOutlined />
      <div className='desc'>图片加载错误，请点击重试!</div>
    </div>
  )

  function getUrl() {
    // if (sessionStorage.getItem(goodsPicture)) {
    //   const url = sessionStorage.getItem(goodsPicture) as string;
    //   getSrc(url);
    //   return
    // }
    if (err) changeErrState(false);
    if (!loading) changeState(true);
    const src = `${import.meta.env.VITE_BASE_URL}/api/admin/file/download?fileName=${goodsPicture}`;
    getSrc(src);
    changeErrState(true);
    // getImgUrl(goodsPicture).then(res => {
    //   const { msg, code, data } = res.data;
    //   if (+code) {
    //     message.error(msg);
    //     changeErrState(true);
    //   } else {
    //     getSrc(`data:image/png;base64,${data as string}`);
    //     // sessionStorage.setItem(goodsPicture, `data:image/png;base64,${data as string}`)
    //   }
    // }).catch(() => {
    //   changeErrState(true)
    // }).finally(() => {
    //   changeState(false)
    // })
  }
  
  useEffect(() => {
    // 监听或者直接请求
    let observe: IntersectionObserver;
    if ('IntersectionObserver' in window) {
      observe = new IntersectionObserver((e, self) => {
        const status = e.some(item => item.intersectionRatio > 0);
        if (status) {
          getUrl();
          self.unobserve(loadContext.current as HTMLDivElement)
        }
      }, { threshold: 0.1 });
      observe.observe(loadContext.current as HTMLDivElement)
    } else getUrl()
    return () => {
      if (observe && loadContext.current) {
        observe.unobserve(loadContext.current as HTMLDivElement);
        observe.disconnect()
      }
    }
  }, [])
  return (
    <div className='load-ctx' ref={loadContext}>
      {
        src
          ? <img src={src} />
          : err
            ? loadErr
            : <Spin spinning={loading} delay={100} />
      }
    </div>
  )
}
