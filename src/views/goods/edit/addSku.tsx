import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
import type { SkuInfo } from "./index";
import { Input, Space, Button, message } from "antd";
import { DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons';
import * as _ from "lodash";
// import { ReactSVG } from 'react-svg';
// import Del from '@/assets/svg/del.svg'

type Props = {
  sku: Request.GoodsSpec[];
  onChange: Dispatch<SetStateAction<SkuInfo>>;
  addGoodsSpec: (data: Request.GoodsSpec) => void;
  updateSpecName: (id: number, name: string) => void;
  updateSpecValue: (id: number, name: string) => void;
  deleteSpec: (i: number, id: number) => void;
  deleteSpecVal: (i: number, index: number, id: number) => void;
  addGoodSpecVal: (id: number, list: string[]) => void;
  onMouseLeave: () => void
};
export default function SkuContext(props: Props) {
  const { sku, onChange, updateSpecName, updateSpecValue, deleteSpec, deleteSpecVal, addGoodSpecVal, onMouseLeave } = props;
  // 修改规格名称
  const changeTitle = (i: number, value: string) => {
    const temp = _.cloneDeep(sku);
    if (temp[i].id) {
      updateSpecName(temp[i].id as number, value);
    } else {
      temp[i]["specName"] = value;
      onChange(data => ({...data, goods_sku: temp}));
    }
    
  };
  // 修改规格值
  const onChangeChild = (i: number, index: number, value: string) => {
    const temp = _.cloneDeep(sku);
    if (temp[i].specValueList[index].id) {
      updateSpecValue(temp[i].specValueList[index].id as number, value)
    } {
      temp[i].specValueList[index].specValue = value;
      onChange(data => ({...data, goods_sku: temp}));
    }
  };
  // 添加规格值
  const onAdd = (i: number) => {
    const temp = _.cloneDeep(sku);
    temp[i].specValueList.push({specValue: ''});
    onChange(data => ({...data, goods_sku: temp}));
  };
  // 删除规格
  const onDelSku = (i: number) => {
    if (sku.length <= 1) {
      message.warning("最少需要一个规格！")
      return
    }
    const temp = _.cloneDeep(sku);
    if (temp[i].id) {
      deleteSpec(i, temp[i].id as number)
    } else {
      temp.splice(i, 1);
      onChange(data => ({...data, goods_sku: temp}));
    }
    
  };
  // 删除规格值
  const onDelChild = (i: number, _i: number) => {
    if (sku[i].specValueList.length === 1) {
      message.warning('最少需要一个规格值！')
      return false
    }
    const temp = _.cloneDeep(sku);
    if (temp[i].specValueList[_i].id) {
      deleteSpecVal(i, _i, temp[i].specValueList[_i].id as number)
    } else {
      temp[i].specValueList.splice(_i, 1);
      onChange(data => ({...data, goods_sku: temp}));
    }
  }

  return (
    <>
      {Array.isArray(sku) && sku.map((item, i) => {
        return (
          <div key={`${item.specName}+${i}`} className="form-sku-ctx-item" onMouseLeave={() => onMouseLeave()}>
            <div className="title">
              <InputValue
                value={item.specName}
                placeholder='输入规格名称'
                showCount={true}
                needDel={false}
                onChange={(val) => changeTitle(i, val)}
                onDel={() => null}
              />
              {/* <Input value={item.title} onChange={(e) => changeTitle(i, e.target.value)} placeholder="输入规格名称" /> */}
            </div>
            <div className="children">
              <Space>
                {Array.isArray(item.specValueList) && item.specValueList.map((row, _i) => (
                  <InputValue
                    value={row.specValue}
                    placeholder={`规格值${_i+1}`}
                    key={`${i}-${_i}-${row.specValue}`}
                    showCount={false}
                    needDel={true}
                    onChange={(val) => onChangeChild(i, _i, val)}
                    onDel={() => onDelChild(i, _i)}
                  />
                ))}
                <Button type="link" onClick={() => onAdd(i)}>
                  添加规格值
                </Button>
              </Space>
            </div>
            <div className="delete-icon" onClick={() => onDelSku(i)}>
              <DeleteOutlined style={{fontSize: '18px'}} />
              {/* <ReactSVG src={Del} /> */}
            </div>
          </div>
        );
      })}
    </>
  );
}

type InputValueProps = {
  value: string;
  placeholder: string;
  showCount: boolean;
  needDel: boolean;
  onChange: (val: string) => void;
  onDel: () => void
};
function InputValue(props: InputValueProps) {
  const [value, updateValue] = useState("");
  const { needDel, onDel } = props;
  const inputVal = useRef<any>(null)

  
  const onBlur = () => {
    props.onChange(value);
  };

  useEffect(() => {
    if (props.value) {
      updateValue(props.value);
    }
  }, [props.value]);
  return (
    <>
      <Input
        className="input-ctx"
        value={value}
        onChange={(e) => updateValue(e.target.value)}
        onBlur={onBlur}
        allowClear
        defaultValue={props.value}
        placeholder={props.placeholder}
        maxLength={50}
        showCount={props.showCount}
        ref={inputVal}
        onMouseLeave={() => inputVal.current.blur()}
      />
      {
        needDel && <span className="del-icon" onClick={onDel}>
          <CloseCircleOutlined />
        </span>
      }
    </>
  );
}
