import { useState, Dispatch, SetStateAction, useRef, useEffect } from "react";
import { Button, Input, Select, DatePicker, Form, Cascader, InputNumber } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import type { Form as FormType, SelectOption } from "./index";

export type Form = {
  spuCode: string;
  goodsName: string;
  categoryId: undefined | number;
  sort: number | undefined;
  createTimeStart: string;
  createTimeEnd: string;
};
type Search = {
  search: () => void;
  getHeader: (h: number) => void;
  onChange: Dispatch<SetStateAction<FormType>>;
  getOption: () => void;
  options: SelectOption[];
};

const { RangePicker } = DatePicker;
export default function Header(props: Search & FormType) {
  const {
    spuCode,
    goodsName,
    categoryId,
    sort,
    createTimeStart,
    createTimeEnd,
    options,
    onChange,
    getOption,
  } = props;
  const searchCtx = useRef<HTMLDivElement | null>(null);
  const [cascaderVal, updateCascVal] = useState<number[]>([]);
  const [date, selectDate] = useState<RangePickerProps["value"] | undefined>(
    undefined
  );
  // 日期选择器触发
  const onChangeDate: RangePickerProps["onChange"] = (
    _: RangePickerProps["value"],
    dateStrings: [string, string]
  ) => {
    const [createTimeStart, createTimeEnd] = dateStrings;
    selectDate(_);
    onChange((data) => {
      return {
        ...data,
        createTimeStart,
        createTimeEnd,
      };
    });
  };

  const onReset = () => {
    onChange(() => ({
      spuCode: "",
      goodsName: "",
      categoryId: undefined,
      sort: undefined,
      createTimeStart: "",
      createTimeEnd: "",
    }));
    updateCascVal([])
  };
  const onSearch = () => {
    props.search();
  };
  function clearSortVal(e: Event) {
    e.stopPropagation();
    onChange((data) => {
      return {
        ...data,
        sort: undefined,
      };
    });
  }
  function onChangeCascVal(val: (number | string)[]) {
    updateCascVal(val as number[]);
    if (val && val.length) {
      onChange(data => ({...data, categoryId: val.at(-1) as number}))
    } else {
      onChange(data => ({...data, categoryId: undefined}))
    }
  }

  useEffect(() => {
    props.getHeader((searchCtx.current as HTMLDivElement).offsetHeight);
    document
      .querySelector(".custom-input-sort .ant-input-suffix")
      ?.addEventListener("click", clearSortVal);
    return () => {
      document
        .querySelector(".custom-input-sort .ant-input-suffix")
        ?.removeEventListener("click", clearSortVal);
    };
  }, []);
  useEffect(() => {
    if (!createTimeStart) {
      selectDate(undefined);
    }
  }, [createTimeStart]);

  return (
    <div className="goods-list-header" ref={searchCtx}>
      <div className="search-group">
        <div className="search-item">
          <span className="search-item-title">商品编码</span>
          <Input
            className="custom-input"
            value={spuCode}
            allowClear
            placeholder="请输入..."
            onChange={(e) =>
              onChange((form) => ({ ...form, spuCode: e.target.value }))
            }
            onPressEnter={onSearch}
          />
        </div>
        <div className="search-item">
          <span className="search-item-title">商品名称</span>
          <Input
            className="custom-input"
            value={goodsName}
            placeholder="请输入..."
            allowClear
            onChange={(e) =>
              onChange((form) => ({ ...form, goodsName: e.target.value }))
            }
            onPressEnter={onSearch}
          />
        </div>
        <div className="search-item">
          <span className="search-item-title">商品分类</span>
          <Cascader
            options={options}
            placeholder="请选择..."
            fieldNames={{
              value: "id",
              label: "catName",
            }}
            onDropdownVisibleChange={(type) =>
              type && getOption()
            }
            value={cascaderVal}
            onChange={(val) => onChangeCascVal(val)}
            className="custom-input"
          />
          {/* <Select
            allowClear
            className="custom-input"
            placeholder="请选择..."
            value={categoryId}
            onChange={(categoryId) => onChange((form) => ({ ...form, categoryId: categoryId }))}
            onDropdownVisibleChange={(type) => type && getOption()}
          >
            {
              options.map(item => <Select.Option key={item.id} value={item.id}>{item.catName}</Select.Option>)
            }
          </Select> */}
        </div>
        <div className="search-item">
          <span className="search-item-title">创建时间</span>
          <RangePicker
            allowClear
            className="custom-input"
            onChange={onChangeDate}
            value={date}
            format="YYYY-MM-DD"
            placeholder={["开始时间", "结束时间"]}
          />
        </div>
        <div className="search-item">
          <span className="search-item-title">排序值</span>
          <InputNumber
            className="custom-input custom-input-sort"
            value={sort}
            placeholder="请输入..."
            type="number"
            onChange={(sort) =>
              onChange((form) => ({ ...form, sort }))
            }
            onPressEnter={onSearch}
          />
        </div>
      </div>
      <div className="btn-group">
        <Button onClick={onReset}>重置</Button>
        <Button
          type="primary"
          style={{ marginLeft: "10px" }}
          onClick={onSearch}
        >
          查询
        </Button>
      </div>
    </div>
  );
}
