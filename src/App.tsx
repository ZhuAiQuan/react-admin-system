import {  useSelector } from "react-redux";
import { useRoutes } from "react-router-dom";
import RouterPremission from "@/router/premission";
import type { State } from '@/store';
import { useMemo } from "react";
import 'antd/dist/antd.less';
import "./App.less";

function App() {
  const user = useSelector((state: State) => state.user);

  const routes = useMemo(() => user.localRoutes, [user.asyncAddRoute])
  const element = useRoutes(routes);
  return (
    <RouterPremission>{element}</RouterPremission>
  );
}

export default App;
