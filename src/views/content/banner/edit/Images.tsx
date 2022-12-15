import { Dispatch, SetStateAction, useState } from 'react';
import type { Info, FormItemLayout } from './index';
import { Form, Input, Button } from 'antd';
import UploadImages from '_c/uploads/UploadImages';
import { DeleteOutlined } from '@ant-design/icons';

const { Item } = Form;
type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
type Props = {
  imgUrl: string;
  title: string;
  subTitle: string;
  formItemLayout: FormItemLayout;
  onChange: Dispatch<SetStateAction<Info>>;
}
interface Rules {
  imgUrl: ValidateStatus;
  imgUrl_help: string;
}
export default function Images(props: Props) {
  const { formItemLayout, title, subTitle, imgUrl, onChange } = props;
  const [rules, setRuleState] = useState<Rules>({
    imgUrl: '',
    imgUrl_help: ''
  });
  function checkImg(img: string) {
    if (!img) {
      setRuleState({
        imgUrl: "error",
        imgUrl_help: "请上传轮播图"
      })
    } else {
      setRuleState({
        imgUrl: "success",
        imgUrl_help: ""
      })
    }
  }

  return (
    <Form className='images-context' {...formItemLayout}>
      <Item label="上传图" required={true}>
        {
          imgUrl
            ? <div className='preview'>
                <img src={imgUrl} alt="上传图片预览" />
                <div className='delete-icon' onClick={() => onChange(data => ({...data, imgUrl: ''}))}><DeleteOutlined style={{fontSize: '50px'}} /></div>
              </div>
            : <UploadImages resolution='1920*768' accept={['image/png', 'image/jpeg']} onChange={(imgUrl) => {onChange(data => ({...data, imgUrl}));checkImg(imgUrl)}} />
        }
      </Item>
      <Item label="主标题" required={false}>
        <Input placeholder='输入主标题内容' value={title} onChange={(e) => onChange(data => ({...data, title: e.target.value}))} showCount allowClear />
      </Item>
      <Item label="副标题" required={false}>
        <Input placeholder='输入副标题内容' value={subTitle} onChange={(e) => onChange(data => ({...data, subTitle: e.target.value}))} showCount allowClear />
      </Item>
    </Form>
  )
}
