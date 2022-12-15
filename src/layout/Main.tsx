import React, { useState } from "react";
import { Outlet } from "react-router-dom";
// import LeftSide from './leftSide';
import Header from "./header";
import NavigateBar from "./header/navigate";
import SegmentEl from "./header/segmented";
import { NodeIndexOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { changeType } from '@/store/slice/global'
import "./index.less";

// export const context = createContext({} as Context);
// export type Context = {
//   toggle: boolean,
//   setToggle: (state: boolean) => void
// }
// const { Provider } = context;
const options = [
  {
    label: "国内",
    value: 1,
    icon: <NodeIndexOutlined />,
  },
  {
    label: "海外",
    value: 0,
    icon: <ShareAltOutlined />,
  },
];
export type Options = typeof options;
export default function Main() {
  const { showLocal, type } = useAppSelector((state) => state.global);
  const dispatch = useAppDispatch()
  const { userInfo: { userName } } = useAppSelector(state => state.user);
  const changeSeg = (seg: number) => {
    dispatch(changeType(seg))
  }

  return (
    <div className="layouts">
      {/* <Header /> */}
      <div className="left-side">
        <div className="logo">
          <div className="logo-ctx"></div>
        </div>
        <NavigateBar />
      </div>
      <div className="container">
        <Header userName={userName} />
        {/* <TabList>
          <Outlet />
        </TabList> */}
        {showLocal && (
          <>
            {/* <div className="seg-ctx">
              <SegmentEl
                options={options}
                value={type}
                onChange={changeSeg}
              />
            </div> */}
          </>
        )}
        <div className={`content ${!showLocal && 'not-check'}`}>
          <Outlet />
        </div>
        
      </div>
    </div>
  );
}
