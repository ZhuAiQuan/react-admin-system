import { useState } from "react";
import { FullscreenOutlined, FullscreenExitOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import MenuItem from "./menu";
import BreadCrumb from "./breadCrumb";

type Props = {
  userName: string;
};

export default function Header({ userName }: Props) {
  const [fullScreenState, setFullScreenState] = useState(false);

  function onFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setFullScreenState(false);
    } else {
      document.documentElement.requestFullscreen();
      setFullScreenState(true);
    }
  }
  return (
    <div className="header">
      {/* <div className='logo'></div> */}
      {/* <NavigateBar /> */}
      <div className="bread-crumb">
        <BreadCrumb />
      </div>
      <div className="featur">
        <div
          className="fullscreen"
          onClick={onFullScreen}
          title="开启/关闭全屏"
        >
          {fullScreenState ? (
            <FullscreenExitOutlined />
          ) : (
            <FullscreenOutlined />
          )}
        </div>
        <div className="avatar">
          <Dropdown
            overlay={MenuItem}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <div>{userName}</div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
