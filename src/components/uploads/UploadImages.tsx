import { useState, Dispatch, SetStateAction } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from 'antd/es/upload';

type Props = {
  accept: string[];
  resolution: string;
  onChange: (str: string) => void;
}
export default function UploadImages(props: Props) {
  const { accept, resolution } = props
  const action = '';

  const onBefore = (file: RcFile) => {
    // 上传前操作
    const isJpgOrPng = accept.includes(file.type);
    const acp = accept.map(item => item.split('/')[1]).join('、')
    if (!isJpgOrPng) {
      message.error(`只能上传${acp}格式的图片!`);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片内存不能大于2M!');
    }
    
    return isJpgOrPng && isLt2M;
  }
  const onChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully`);
      props.onChange(info.file.url as string)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  const onRemove = () => {
    props.onChange('')
  }
  return (
    <Upload action={action} onChange={onChange} onRemove={onRemove} beforeUpload={onBefore} showUploadList={false}>
      <Button icon={<UploadOutlined />}>上传图片</Button>
    </Upload>
  )
}
