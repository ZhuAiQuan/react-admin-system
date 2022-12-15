import { useState, useEffect } from "react";
import { Button, Space, Form, Input } from "antd";
import Dialog from "_c/modal";
import Uploads from "_c/uploads";
import "./index.less";

const { Item } = Form;
const { TextArea } = Input;

type ValidateStatus = Parameters<typeof Form.Item>[0]["validateStatus"];
type Rules = {
  imgUrl: ValidateStatus;
  imgUrl_help: string;
  link: ValidateStatus;
  link_help: string;
};
type ChannelList = {
  imgUrl: string;
  link: string;
}
export default function index() {
  const [modal, updateModal] = useState({
    visible: false,
    title: "",
  });
  const [form, setForm] = useState<ChannelList>({
    imgUrl: "",
    link: "",
  });
  const [rules, changeRules] = useState<Rules>({
    imgUrl: "",
    imgUrl_help: "",
    link: "",
    link_help: "",
  });
  const [channelList, getList] = useState<ChannelList[]>([]);
  const [uploads, uploadConfig] = useState({
    showUploadList: false,
    accept: ['image/png', 'image/jpeg', 'image/bmp'],
    maxCount: 1
  })
  const footer = (
    <Space>
      <Button
        onClick={() => updateModal((data) => ({ ...data, visible: false }))}
      >
        取消
      </Button>
      <Button type="primary" onClick={onSubmit}>
        确定
      </Button>
    </Space>
  );

  // 新建渠道
  function onAdd() {
    updateModal((data) => {
      return {
        ...data,
        visible: true,
        title: "新建渠道",
      };
    });
  }
  function onSubmit() {
    if (form.imgUrl && form.link.trim()) {
      // 提交
    } else {
      for(const item in form) {
        if (!form[item as keyof ChannelList]) onChange(item, form[item as keyof ChannelList])
      }
    }
  }
  // 手动校验
  function onChange(key: string, value: string) {
    setForm((data) => {
      return {
        ...data,
        [key]: value,
      };
    });
    if (!value) {
      changeRules((data) => {
        return {
          ...data,
          [key]: "error",
          [`${key}_help`]: `请${
            key === "link" ? "输入链接地址" : "上传渠道图片!"
          }`,
        };
      });
    } else {
      changeRules((data) => {
        return {
          ...data,
          [key]: "",
          [`${key}_help`]: "",
        };
      });
    }
  }
  // 编辑渠道
  function onEdit(row: ChannelList) {
    setForm(row);
    updateModal(data => {
      return {
        ...data,
        visible: true,
        title: '编辑渠道'
      }
    })
  }
  // 上传图片
  function onUploads(imgUrl: string | string[]) {
    setForm(data => {
      return {
        ...data,
        imgUrl: imgUrl as string
      }
    })
    
  }

  useEffect(() => {
    if (modal.visible) {
      // 操作
    } else {
      setForm({ imgUrl: "", link: "" });
      changeRules({ imgUrl: "", imgUrl_help: "", link: "", link_help: "" });
    }
  }, [modal.visible]);
  return (
    <div className="channel-ctx">
      <div className="add">
        <Button type="primary" onClick={onAdd}>
          新建渠道
        </Button>
      </div>
      <div className="channel-context">
        {
          channelList.map(item => (<div className="channel-context" key={item.link} onClick={() => onEdit(item)}><img src={item.imgUrl} alt={item.link} /></div>))
        }
      </div>
      <Dialog {...modal} footer={footer} onCancel={() => updateModal((data) => ({ ...data, visible: false }))}>
        <Form>
          <Item
            label="渠道图片"
            required={true}
            validateStatus={rules.imgUrl}
            help={rules.imgUrl_help}
          >
            <Uploads {...uploads} onUploads={onUploads} size={''} defaultList={form.imgUrl} />
            <div className="text-descript">
              图片尺寸：420*116 px，图片格式：：png、jpeg、bmp、jpg，白底背景
            </div>
          </Item>
          <Item
            label="链接"
            required={true}
            validateStatus={rules.link}
            help={rules.link_help}
          >
            <TextArea
              value={form.link}
              placeholder="请输入链接"
              onChange={(e) => onChange("link", e.target.value)}
            />
          </Item>
        </Form>
      </Dialog>
    </div>
  );
}
