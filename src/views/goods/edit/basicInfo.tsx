import {
  Dispatch,
  SetStateAction,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useMemo,
  ForwardRefRenderFunction
} from "react";
import type { BasicInfo as BasicType, FormItemLayout, Configs, BasicImpHandle } from "./index";
import { Form, Cascader, Input, InputNumber, Select, Space } from "antd";
import * as _ from "lodash";

const { Option } = Select;
type ValidateStatus = Parameters<typeof Form.Item>[0]["validateStatus"];

interface Rules {
  goodsName: ValidateStatus;
  categoryIdList: ValidateStatus;
  goodsAttrIdList: ValidateStatus;
  goodsName_help: string;
  categoryIdList_help: string;
  goodsAttrIdList_help: string;
  sort: ValidateStatus;
  sort_help: string;
}
interface Props extends BasicType {
  onChange: Dispatch<SetStateAction<BasicType>>;
  formItemLayout: FormItemLayout;
  minIndex: number;
  catNameOptions: Configs["catNameOptions"];
  catAttrOptions: Configs["catAttrOptions"];
  attrState: boolean;
  getOptionCatName: () => void;
  getOptionsAttr: (id?: number) => void;
  checkSort: (sort: number) => void
}
const BasicInfo: ForwardRefRenderFunction<BasicImpHandle, Props> = (props, formRef) => {
  const {
    onChange,
    categoryIdList,
    goodsName,
    spuCode,
    sort,
    productDescription,
    formItemLayout,
    minIndex,
    catNameOptions,
    categoryNameList,
    attrState,
    catAttrOptions,
    goodsAttrRes,
    goodsAttrIdList,
    getOptionCatName,
    getOptionsAttr,
    checkSort,
  } = props;
  const [rules, updateRules] = useState<Rules>({
    goodsName: "",
    goodsName_help: "",
    categoryIdList: "",
    categoryIdList_help: "",
    goodsAttrIdList: "",
    goodsAttrIdList_help: "",
    sort: "",
    sort_help: "",
  });
  const basicContext = useRef<HTMLDivElement | null>(null);
  const scrollTop = useMemo(() => {
    if (basicContext.current as HTMLDivElement) {
      return basicContext.current?.offsetHeight as number
    } else return 0
  }, [basicContext.current])

  const changeCascader = (
    value: (number | string)[],
    categoryNameList: unknown
  ) => {
    if (value) {
      onChange((data) => {
        return {
          ...data,
          categoryIdList: value as number[],
          categoryNameList: categoryNameList as Request.RequestCatNameTreeData[],
          goodsAttrRes: [],
          goodsAttrIdList: [],
        };
      });
      // 请求获取商品属性值
      getOptionsAttr(value.at(-1) as number)
    } else {
      onChange((data) => {
        return {
          ...data,
          categoryIdList: [],
          categoryNameList: [],
          goodsAttrRes: [],
          goodsAttrIdList: [],
        };
      });
    }
    
  };
  const changeData = (key: string, value: string | number | number[]) => {
    // 校验规则
    // @ts-ignore
    if (check()[key]) check()[key](value);
    onChange((data) => {
      return {
        ...data,
        [key]: value,
      };
    });
  };
  function check() {
    const goodsName = (name: string) => {
      let valid: ValidateStatus = "success";
      let help = "";
      if (!name.trim().length) {
        valid = 'error';
        help = '请输入商品名称！'
      }
      updateRules((data) => {
        return {
          ...data,
          goodsName: valid,
          goodsName_help: help,
        };
      });
      if (help) return false
      else return true
    };
    const categoryIdList = (val: number[]) => {
      let valid: ValidateStatus = "success";
      let help = "";
      if (!val.length) {
        valid = "error";
        help = "请选择商品分类信息！";
      }
      updateRules((data) => {
        return {
          ...data,
          categoryIdList: valid,
          categoryIdList_help: help,
        };
      });
      if (help) return false;
      else return true;
    };
    const goodsAttrIdList = (val: number[]) => {
      let valid: ValidateStatus = "success";
      let help = "";
      if (!val.length) {
        valid = "error";
        help = "请选择商品属性信息！";
      }
      if (val.some(item => item === -1)) {
        valid = "error";
        help = "请选择下拉框里商品的属性值！";
      }
      updateRules((data) => {
        return {
          ...data,
          goodsAttrIdList: valid,
          goodsAttrIdList_help: help,
        };
      });
      if (help) return false;
      else return true;
    };
    const sort = (val: number) => {
      let valid: ValidateStatus = "success";
      let help = "";
      if (!val && val !== 0) {
        valid = "error";
        help = "请输入排序值！";
      } else if (val === -1) {
        valid = "error";
        help = "排序值错误！";
      }
      updateRules((data) => {
        return {
          ...data,
          sort: valid,
          sort_help: help,
        };
      });
      if (help) return false;
      else return true;
    };
    return {
      goodsName,
      categoryIdList,
      goodsAttrIdList,
      sort,
    };
  }
  // 提交校验
  function validate() {
    const obj: any = {
      goodsName,
      categoryIdList,
      sort,
    };
    if (catNameOptions.length && catAttrOptions.length) {
      obj.goodsAttrIdList = goodsAttrIdList;
      updateRules(data => {
        return {
          ...data,
          goodsAttrIdList: "success",
          goodsAttrIdList_help: ""
        }
      })
    }
    const status: boolean[] = [];
    for (const key in obj) {
      // @ts-ignore
      status.push(
        check()[key as keyof ReturnType<typeof check>](
          // @ts-ignore
          obj[key as keyof typeof obj]
        )
      );
    }
    return status;
  }
  function onSelectId(i: number, data: Request.GoodsAttrRes | null) {
    const temp = _.cloneDeep(goodsAttrRes);
    const list = _.cloneDeep(goodsAttrIdList);
    if (data) {
      temp.splice(i, 1, data as Request.GoodsAttrRes);
      list.splice(i, 1, data.attrValueId)
    } else {
      temp[i].attrName = "";
      temp[i].attrValue = "";
      temp[i].attrValueId = 0;
      temp[i].categoryAttrId = 0;
      list.splice(i, 1, -1)
    }
    
    onChange((data) => {
      return {
        ...data,
        goodsAttrRes: temp,
        goodsAttrIdList: list
      };
    });
  }
  function validateSort(sort: ValidateStatus, sort_help: string) {
    updateRules(data => {
      return {
        ...data,
        sort,
        sort_help
      }
    })
  }
  // 清楚表单校验状态
  function clearFormValidate(key: string) {
    updateRules(data => {
      return {
        ...data,
        [key]: "success",
        [`${key}_help`]: ""
      }
    })
  }

  useImperativeHandle(formRef, () => ({
    validate,
    validateSort,
    clearFormValidate,
    scrollTop
  }));
  return (
    <div ref={basicContext}>
      <div className="form-group-title">基础信息</div>
      <Form className="form" {...formItemLayout}>
        <Form.Item
          label="商品分类"
          validateStatus={rules.categoryIdList}
          help={rules.categoryIdList_help}
          required={true}
        >
          <Cascader
            
            options={catNameOptions}
            onDropdownVisibleChange={(type) =>
              type && getOptionCatName()
            }
            fieldNames={{
              value: "id",
              label: "catName",
            }}
            value={categoryIdList}
            onChange={changeCascader}
            placeholder="选择商品分类"
          ></Cascader>
        </Form.Item>
        <Form.Item
          label="商品名称"
          validateStatus={rules.goodsName}
          help={rules.goodsName_help}
          required={true}
        >
          <Input
            allowClear
            showCount
            maxLength={60}
            value={goodsName}
            onChange={(e) => changeData("goodsName", e.target.value)}
            placeholder="输入商品名称"
          />
        </Form.Item>
        <Form.Item label="商品编码">
          <Input
            allowClear
            showCount
            maxLength={60}
            value={spuCode}
            onChange={(e) => changeData("spuCode", e.target.value)}
          />
        </Form.Item>
        <Form.Item label="排序值" required={true} validateStatus={rules.sort} help={rules.sort_help}>
          <InputNumber
            value={sort}
            onChange={(n) => changeData("sort", n)}
            style={{ width: "100%" }}
            min={minIndex}
            placeholder="排序值越大，在官网展示越靠前"
            onBlur={(e) => checkSort(e.target.value as any as number)}
          />
        </Form.Item>
        <Form.Item label="商品卖点">
          <Input.TextArea
            value={productDescription}
            onChange={(e) => changeData("productDescription", e.target.value)}
            showCount
            rows={6}
          />
        </Form.Item>
        <Form.Item
          label="商品属性"
          required={catNameOptions.length ? attrState : true}
          validateStatus={rules.goodsAttrIdList}
          help={rules.goodsAttrIdList_help}
          className="custom-form-item"
        >
          {
            catNameOptions.length && catAttrOptions.length ?
              <Space>
                {catAttrOptions.map((item, i) => {
                  return (
                    <div key={item.categoryAttrId} className="attr-ctx">
                      <div className="attr-name">{item.attrName}</div>
                      <OnSelect
                        option={item.categoryAttrValueResList}
                        index={i}
                        attrName={item.attrName}
                        categoryAttrId={item.categoryAttrId}
                        onSelectId={onSelectId}
                        target={goodsAttrIdList[i]}
                      />
                    </div>
                  );
                })}
              </Space> : ''
          }
          {
            !catNameOptions.length ? <span className="vali">请先选择商品分类！</span> : ''
          }
          {
            catNameOptions.length && !catAttrOptions.length ? <span>暂无商品属性值</span> : ''
          }
          
        </Form.Item>
      </Form>
    </div>
  );
}

export default forwardRef(BasicInfo);

type SelectProps = {
  option: Request.CategoryAttrValueResList[];
  attrName: string;
  categoryAttrId: number;
  index: number;
  target: number;
  onSelectId: (i: number, data: Request.GoodsAttrRes | null) => void;
};
function OnSelect(props: SelectProps) {
  const { option, categoryAttrId, attrName, index, target, onSelectId } = props;
  const [selectId, setSelectId] = useState<number | undefined>(undefined);
  const state = useRef(true);

  function onChange(value: number) {
    setSelectId(value);
    if (value) {
      const temp = option.filter((item) => item.attrValueId === value);
      const { attrValue } = temp[0];
      const obj = { categoryAttrId, attrName, attrValue, attrValueId: value };
      onSelectId(index, obj);
    } else onSelectId(index, null);
  }
  useEffect(() => {
    if (state.current) {
      state.current = false;
      if (target && target >= 0) {
        setSelectId(target)
      } else {
        setSelectId(undefined)
      }
    }
    
  }, []);

  return (
    <Select
      allowClear
      value={selectId}
      onChange={onChange}
      style={{ width: "200px" }}
      placeholder="请选择..."
      dropdownClassName="drop-menu-item"
    >
      {option.map((item) => (
        <Option key={item.attrValueId} value={item.attrValueId}>
          {item.attrValue}
        </Option>
      ))}
    </Select>
  );
}
