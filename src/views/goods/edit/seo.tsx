import { Dispatch, SetStateAction, useState, useImperativeHandle, forwardRef, ForwardRefRenderFunction } from "react";
import { Form, Input } from "antd";
import type { FormItemLayout, SeoInfo, SeoImpHandle } from "./index";
const { Item } = Form;
const { TextArea } = Input;

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];
interface Props extends SeoInfo {
  formItemLayout: FormItemLayout;
  onChange: Dispatch<SetStateAction<SeoInfo>>;
}
type Rules = {
  seoTitle: ValidateStatus;
  seoTitle_help: string;
  seoKeywords: ValidateStatus;
  seoKeywords_help: string;
  seoDescription: ValidateStatus;
  seoDescription_help: string;
}
const GoodSeo: ForwardRefRenderFunction<SeoImpHandle, Props> = (props, ref) => {
  const { formItemLayout, onChange, seoTitle, seoKeywords, seoDescription } = props;
  const [rules, updateRules] = useState<Rules>({
    seoTitle: '',
    seoTitle_help: '',
    seoKeywords: '',
    seoKeywords_help: '',
    seoDescription: '',
    seoDescription_help: ''
  })
  const onChangeValue = (key: string, value: string, need = true) => {
    if (need) {
      onChange(data => {
        return {
          ...data,
          [key]: value
        }
      });
    }
    
    if (!value.trim()) {
      updateRules(data => {
        return {
          ...data,
          [key]: "error",
          [`${key}_help`]: "请输入"
        }
      })
      return false
    } else {
      updateRules(data => {
        return {
          ...data,
          [key]: "success",
          [`${key}_help`]: ""
        }
      })
      return true
    }
  }
  // 校验表单
  function validate() {
    const obj = {
      seoTitle,
      seoKeywords,
      seoDescription
    };
    const status: boolean[] = [];
    for(const key in obj) {
      status.push(onChangeValue(key, obj[key as keyof typeof obj], false))
    }
    return status
  }
  useImperativeHandle(ref, () => ({
    validate
  }))

  return (
    <>
      <div className="form-group-title" style={{paddingTop: '30px'}}>SEO信息</div>
      <Form {...formItemLayout}>
        <Item label="页面标题" required={true} validateStatus={rules.seoTitle} help={rules.seoTitle_help}>
          <Input
            maxLength={100}
            showCount
            onChange={(e) =>
              onChangeValue('seoTitle', e.target.value)
            }
            value={seoTitle}
            allowClear
            placeholder="请输入页面标题..."
          />
        </Item>
        <Item label="搜索关键词" required={true} validateStatus={rules.seoKeywords} help={rules.seoKeywords_help}>
          <TextArea
            maxLength={100}
            showCount
            placeholder="多个关键词用“；”隔离"
            rows={6}
            onChange={(e) =>
              onChangeValue('seoKeywords', e.target.value)
            }
            value={seoKeywords}
            allowClear
          />
        </Item>
        <Item label="页面描述" required={true} validateStatus={rules.seoDescription} help={rules.seoDescription_help}>
          <TextArea
            maxLength={100}
            showCount
            rows={8}
            onChange={(e) =>
              onChangeValue('seoDescription', e.target.value)
            }
            value={seoDescription}
            allowClear
            placeholder="请输入页面描述信息..."
          />
        </Item>
      </Form>
    </>
  );
}

export default forwardRef(GoodSeo)
