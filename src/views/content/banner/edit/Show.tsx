import React from 'react';
import { Form, Radio, Space } from 'antd';
import type { RadioOptions, FormItemLayout } from './index'

const { Item } = Form;
const { Group } = Radio
type Props = {
  show: boolean,
  options: RadioOptions;
  formItemLayout: FormItemLayout;
  onChange: (show: boolean) => void
}
export default function Show(props: Props) {
  const { show, options, formItemLayout, onChange } = props;
  return (
    <Form className='show-context' {...formItemLayout}>
      <Item label="是否上架" required={true}>
        <Group value={show} onChange={(e) => onChange(e.target.value)}>
          <Space direction='vertical'>
            {
              options.map(item => <Radio key={item.label} value={item.value}>{item.label}</Radio>)
            }
          </Space>
        </Group>
      </Item>
    </Form>
  )
}
