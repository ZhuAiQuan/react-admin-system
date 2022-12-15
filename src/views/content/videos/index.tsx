import { useState, useEffect, useRef } from 'react';
import { Space, Button } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import './index.less'

export default function Videos() {
  const [src, setSrc] = useState('http://edge.ivideo.sina.com.cn/146923586.mp4?KID=sina,viask&Expires=1658851200&ssig=0vzwOhciN6&reqid=');
  const [played, setState] = useState(false)
  const video = useRef<HTMLVideoElement | null>(null);

  function onPlay() {
    const ctx = video.current as HTMLVideoElement;
    if (played) {
      ctx.pause();
      setState(false)
    } else {
      ctx.play();
      setState(true)
    }
    
  }
  return (
    <div className='video-context'>
      <div className='video'>
        <video src={src} ref={video}></video>
        <div className='play' onClick={onPlay}>
          {
            played ? <PauseCircleOutlined style={{fontSize: '100px'}} /> : <PlayCircleOutlined style={{fontSize: '100px'}} />
          }
          
        </div>
      </div>
      <div className='footer'>
        <Button type='primary'>更换视频</Button>
      </div>
    </div>
  )
}
