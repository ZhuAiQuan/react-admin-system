import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Form, Input, Checkbox, Button, message } from "antd";
import * as _ from "lodash";
import Uploads from "_c/uploads";
import type { CategoryState, Target } from "./index";
import { addGoodsCategory, setGoodsCategory } from "api/goods";

const { Item } = Form;
type ValidateStatus = Parameters<typeof Form.Item>[0]["validateStatus"];
type Props = {
  // id: number;
  getTree: () => void;
  onCloseModal: () => void;
};
interface ShowLocal {
  title: string;
  key: "showCategory" | "showNav";
  descript: string;
  fileName: string;
  size: string;
}
export interface Form {
  catName: string;
  defaultValue: string[];
}
interface Rules {
  catName: ValidateStatus;
  catName_help: string;
  defaultValue: ValidateStatus;
  defaultValue_help: string;
  showNav: ValidateStatus;
  showNav_help: string;
}
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
function CategorySetting(props: Props & CategoryState & Target, ref: any) {
  const { id, status, pid, type, temp, getTree, onCloseModal, level } = props;

  const [form, updateForm] = useState<Form>({
    catName: "",
    defaultValue: [],
  });
  const [showLocal, setLocal] = useState<ShowLocal[]>([
    {
      title: "导航",
      key: "showNav",
      descript: "图片尺寸：280*280px，图片格式：png、jpeg，透明背景",
      fileName: "",
      size: "280*280",
    },
    {
      title: "品类窗口",
      key: "showCategory",
      descript: "图片尺寸：676*800px，图片格式：png、jpeg",
      fileName: "",
      size: "676*800",
    },
  ]);
  const [rules, setRules] = useState<Rules>({
    catName: "",
    catName_help: "",
    defaultValue: "",
    defaultValue_help: "",
    showNav: 'success',
    showNav_help: "",
  });
  // 多选触发
  function onChange(type: boolean, key: string) {
    if (type) {
      updateForm((data) => ({
        ...data,
        defaultValue: data.defaultValue.concat(key),
      }));
    } else {
      const i = form.defaultValue.indexOf(key);
      if (i > -1) {
        const temp = _.cloneDeep(form);
        temp.defaultValue.splice(i, 1);
        updateForm(temp);
        // 清除已上传的图片
        const local = _.cloneDeep(showLocal);
        for (let i = 0; i < local.length; i++) {
          if (local[i].key === key) {
            local[i].fileName = '';
            break;
          }
        }
        setLocal(local);
      }
    }
  }
  // 提交表单校验
  function validateForm(key: keyof typeof form, value: string | string[]) {
    let text: ValidateStatus = "success";
    let text_help = "";
    if (typeof value === "string") {
      if (!value) {
        text = "error";
        text_help = "请输入分类名称";
      }
    } else if (value instanceof Array) {
      if (value.length) {
        if (value.includes("showNav") && !showLocal[0].fileName) {
          text = "error";
          text_help = "请上传在导航位置的图片";
        }
        if (value.includes("showCategory") && !showLocal[1].fileName) {
          text = "error";
          text_help = "请上传在品类窗口位置的图片";
        }
      }
    }
    setRules((data) => {
      return {
        ...data,
        [key]: text,
        [`${key}_help`]: text_help,
      };
    });
    if (text === "error") return false;
    else return true;
  }
  function onSubmit() {
    const valite: boolean[] = [];
    if (status === 'edit' && level < 2) {
      valite.push(validateForm('catName', form.catName));
      valite.push(!!showLocal[0].fileName);
      let val: ValidateStatus = "success";
      let help = "";
      if (!showLocal[0].fileName) {
        val = 'error';
        help = '请上传品牌图标';
      }
      setRules(data => {
        return {
          ...data,
          showNav: val,
          showNav_help: help
        }
      })
    } else {
      for (const key in form) {
        const state = validateForm(key as keyof Form, form[key as keyof Form]);
        valite.push(state);
      }
    }
    
    if (valite.some((item) => !item)) {
      return;
    }
    const obj: Partial<Request.AddGoodsCategoryParmas> = {};
    obj.catName = form.catName;
    showLocal.forEach((item) => {
      if (item.fileName) {
        obj[item.key] = "0";
        obj[`${item.key}Img`] = item.fileName;
      } else {
        obj[item.key] = "1";
        obj[`${item.key}Img`] = "";
      }
    });
    obj.pid = pid;
    obj.overseas = type;
    // 提交
    if (status === "add") {
      // 新增
      addGoodsCategory(obj).then((res) => {
        // console.log(res)
        // 刷新树
        const {
          data: { code, msg },
        } = res;
        if (!+code) {
          getTree();
          onCloseModal();
          clearFormData();
        } else {
          message.error(msg);
        }
      });
    } else {
      // 编辑
      obj.id = id;
      setGoodsCategory(obj).then((res) => {
        const {
          data: { code, msg },
        } = res;
        if (!+code) {
          message.success(msg);
          getTree();
          // clearFormData();
        } else {
          message.error(msg);
        }
      });
    }
  }
  function onUploads(fileName: string, i: number) {
    const temp = _.cloneDeep(showLocal);
    temp[i].fileName = fileName;
    setLocal(temp);
  }
  // 清空表单数据
  function clearFormData() {
    updateForm({ catName: "", defaultValue: [] });
    setRules(() => {
      return {
        catName: "success",
        catName_help: "",
        defaultValue: "success",
        defaultValue_help: "",
        showNav: "success",
        showNav_help: ""
      };
    });
    const temp = _.cloneDeep(showLocal);
    temp.forEach((item) => {
      item.fileName = "";
    });
    setLocal(temp);
  }
  // function onRemove()
  useEffect(() => {
    if (status === "edit" && (temp as Request.CategoryTree)) {
      // temp?.showCategory
      const data = _.cloneDeep(showLocal);
      data.forEach((item) => {
        if (item.key === "showCategory") {
          item.fileName = temp!.showCategoryImg || "";
        } else if (item.key === "showNav") {
          item.fileName = temp!.showNavImg || "";
        }
      });
      setLocal(_.cloneDeep(data));
      const defaultValue: string[] = [];
      temp!.showCategory === 0 && defaultValue.push("showCategory");
      temp!.showNav === 0 && defaultValue.push("showNav");
      updateForm({ catName: temp!.catName || "", defaultValue });
    } else if (status === "add") {
      updateForm({ catName: "", defaultValue: [] });
      const temp = _.cloneDeep(showLocal);
      temp.forEach((item) => {
        item.fileName = "";
      });
      setLocal(temp);
    }
    return () => {
      clearFormData()
    }
  }, [status, temp]);

  useImperativeHandle(ref, () => ({
    onSubmit,
  }));

  return (
    <Form {...formItemLayout} className="category-setting">
      <Item
        label="分类名称"
        required={true}
        validateStatus={rules.catName}
        help={rules.catName_help}
      >
        <Input
          value={form.catName}
          onChange={(e) =>
            updateForm((data) => ({ ...data, catName: e.target.value }))
          }
          placeholder="输入分类名称，长度最多30"
          maxLength={30}
        />
      </Item>
      {status === "edit" && level === 2 && (
        <Item
          label="首页展示位置"
          validateStatus={rules.defaultValue}
          help={rules.defaultValue_help}
        >
          <div className="tips">
            若勾选多个品牌的产品分类，则在导航中会按照品牌进行区分
          </div>
          {showLocal.map((item, i) => {
            return (
              <div className="show-local-item" key={`${item.key}+${item.fileName}-${i}`}>
                <Checkbox
                  checked={form.defaultValue.includes(item.key)}
                  onChange={(e) => onChange(e.target.checked, item.key)}
                >
                  {item.title}
                </Checkbox>
                {form.defaultValue.includes(item.key) && (
                  <div className="upload-ctx">
                    <Uploads
                      showUploadList={false}
                      size={item.size}
                      maxCount={1}
                      accept={["image/png", "image/jpeg"]}
                      defaultList={item.fileName}
                      onUploads={(fileName) => onUploads(fileName, i)}
                    />
                    <div className="upload-descript">{item.descript}</div>
                  </div>
                )}
              </div>
            );
          })}
        </Item>
      )}
      {/* {
        status === 'edit' && level !== 2 && (
          <Item label="品牌图标" required={true} validateStatus={rules.showNav} help={rules.showNav_help}>
            {
              showLocal.slice(0, 1).map(item => (
                <div className="upload-ctx" key={`${item.key}+${item.fileName}`} style={{paddingTop: '10px'}}>
                  <Uploads
                    showUploadList={false}
                    size="420*120"
                    maxCount={1}
                    accept={["image/png", "image/jpeg"]}
                    defaultList={item.fileName}
                    onUploads={(fileName) => onUploads(fileName, 0)}
                  />
                  <div className="upload-descript">图片尺寸：420*120px；图片格式：png</div>
                </div>
              ))
            }
          </Item>
        )
      } */}

      {status === "edit" && (
        <Item className="form-sub-btn">
          <Button type="primary" onClick={onSubmit}>
            保存
          </Button>
        </Item>
      )}
    </Form>
  );
}

export default forwardRef(CategorySetting);
