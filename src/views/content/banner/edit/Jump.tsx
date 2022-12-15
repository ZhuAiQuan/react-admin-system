import { useState } from 'react'
import type { JumpOptions, Info, FormItemLayout } from './index';
import { Form, Radio, Space, Input, Select } from 'antd';
import Editor from '_c/editor'

const { Item } = Form;
const { Group } = Radio;
type Props = {
  type: keyof JumpOptions;
  jump: JumpOptions;
  formItemLayout: FormItemLayout;
  onChange: (key: keyof Info, val: string) => void
}
export default function Jump(props: Props) {
  const { type, jump, formItemLayout, onChange } = props;
  const [text, getText] = useState('');

  return (
    <Form className='jump-context' {...formItemLayout}>
      <Item label="类型" required={true}>
        <Group value={type} onChange={(e) => onChange('type', e.target.value)}>
          <Space>
            {
              Object.keys(jump).map(item => <Radio value={item} key={item}>{jump[item as keyof JumpOptions]}</Radio>)
            }
          </Space>
        </Group>
      </Item>
      {
        type === 'custom' && <Editor text={text} getText={getText} />
      }
      {
        type === 'detail' && <Item label="商品" required={true}>
          <Select></Select>
        </Item>
      }
      {
        type === 'link' && <Item label="链接" required={true}>
          <Input />
        </Item>
      }
    </Form>
  )
}
