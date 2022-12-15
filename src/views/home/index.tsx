import React from "react";
import avatar from '@/assets/images/home.jpg';
import './index.less'

export default function Home() {
  return (
    <div className="home-page">
      <div>
        <img src={avatar} alt="" />
        <div className="description"></div>
      </div>
      
    </div>
  );
}
