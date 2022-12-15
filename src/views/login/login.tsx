import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import type { LoginData } from './index'

interface Props {
  onSuccess: (data: LoginData) => void
}
export default function LoginForm(props: Props) {
  const onFinish = (values: LoginData) => {
    // console.log(values);
    // 登录成功后触发获取路由权限
    props.onSuccess(values)
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "请输入登录账号!" }]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="账号"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "请输入密码!" }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="密码"
          autoComplete=""
        />
      </Form.Item>
      <Form.Item className="login-btn">
        <Button type="primary" htmlType="submit" className="login-form-button" block size="large">
          登录
        </Button>
        {/* Or <a href="">register now!</a> */}
      </Form.Item>
      {/* <div className="forgot-password">
        <a href="#">忘记密码</a>
      </div> */}
    </Form>
  );
}
