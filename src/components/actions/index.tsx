import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Space } from "antd";
import "./index.less";

export default function Actions() {
  const location = useNavigate();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const time = setInterval(() => {
      setCount(count => {
        if (!(count-1)) {
          clearInterval(time);
          location(-1);
        }
        return count-1
      });
    }, 1000);
    return () => {
      clearInterval(time)
    }
  }, [])

  return (
    <div className="actions">
      <Space>
        <Button type="link" onClick={() => location("/", { replace: true })}>
          返回首页
        </Button>
        <Button type="link" onClick={() => location(-1)}>
          返回上一页({count}秒后自动返回)
        </Button>
      </Space>
    </div>
  );
}
