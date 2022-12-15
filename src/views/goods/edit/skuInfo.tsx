import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  ForwardRefRenderFunction,
} from "react";
import type { SkuInfo, FormItemLayout, SkuInfoImpHandle } from "./index";
import { Form, Button, message, Input, Table, Tooltip } from "antd";
import SkuContext from "./addSku";
import Uploads from "_c/uploads";
import * as _ from "lodash";
import DragAbleUploadListItem from "_c/uploads/dragAbleUploadListItem";

const { Item } = Form;
const { Column } = Table;

type ValidateStatus = Parameters<typeof Form.Item>[0]["validateStatus"];
interface Props extends SkuInfo {
  onChange: Dispatch<SetStateAction<SkuInfo>>;
  formItemLayout: FormItemLayout;
  addGoodsSpec: (data: Request.GoodsSpec) => void;
  updateSpecName: (id: number, name: string) => void;
  updateSpecValue: (id: number, name: string) => void;
  deleteSpec: (i: number, id: number) => void;
  deleteSpecVal: (i: number, index: number, id: number) => void;
  addGoodSpecVal: (id: number, list: string[]) => void;
}
interface Rules {
  goods_sku: ValidateStatus;
  goods_sku_help: string;
  dataSource: ValidateStatus;
  dataSource_help: string;
  specPictureReqList: ValidateStatus;
  specPictureReqList_help: string;
}

const SkuInfoData: ForwardRefRenderFunction<SkuInfoImpHandle, Props> = (
  props,
  ref
) => {
  const {
    goods_sku,
    onChange,
    formItemLayout,
    addGoodsSpec,
    dataSource,
    columns,
    specPictureReqList,
    updateSpecName,
    updateSpecValue,
    deleteSpec,
    deleteSpecVal,
    addGoodSpecVal,
  } = props;

  const skuContext = useRef<HTMLDivElement | null>(null);

  const [rules, setRules] = useState<Rules>({
    goods_sku: "",
    goods_sku_help: "",
    dataSource: "",
    dataSource_help: "",
    specPictureReqList: "",
    specPictureReqList_help: "",
  });
  // 添加规格项目
  const onAddSku = () => {
    if (goods_sku.length >= 5) {
      message.warning("最多可以创建5个规格类！");
    } else {
      const status = goods_sku.map((item) => {
        if (
          item.specName &&
          item.specValueList.every((item) => item.specValue.trim())
        )
          return true;
        else return false;
      });
      if (status.some((item) => !item)) {
        message.destroy();
        message.warning({
          duration: 10,
          content: "规格名称/规格值必填，请补充或者删除对应的数据！",
        });
        return;
      } else {
        // 通过请求添加数据(如果没有id的话)
        const data = goods_sku.at(-1) as Request.GoodsSpec;
        if (!data.id) addGoodsSpec(data);
        else {
          const temp = _.cloneDeep(goods_sku);
          temp.push({
            specName: "",
            specValueList: [{ specValue: "" }],
          });
          onChange((data) => {
            return {
              ...data,
              goods_sku: temp,
            };
          });
        }
        // 创建规格明细和规格图片结构
      }
    }
  };
  function onChangeText(text: string, record: any) {
    debugger;
    const temp = _.cloneDeep(dataSource);
    let i = -1;
    for (let index = 0; index < temp.length; index++) {
      if (temp[index].goodsSpec.toString() === record.goodsSpec.toString()) {
        i = index;
      }
    }
    if (i < 0) return;
    temp[i].skuCode = text;
    debugger;
    onChange((data) => {
      return {
        ...data,
        dataSource: temp,
      };
    });
  }
  // 上传图片 赋值
  function onUploads(goodsPicture: string, i: number) {
    const temp = _.cloneDeep(specPictureReqList);
    temp[i].specPictureValueReqList.push({ goodsPicture });
    onChange((data) => {
      return {
        ...data,
        specPictureReqList: temp,
      };
    });
  }
  // 移除上传图片
  function onRemoveUpload(i: number, index: number) {
    const temp = _.cloneDeep(specPictureReqList);
    temp[i].specPictureValueReqList.splice(index, 1);
    onChange((data) => {
      return {
        ...data,
        specPictureReqList: temp,
      };
    });
  }
  // 鼠标移开商品规格div后触发 需要防抖
  function onLeave() {
    goods_sku.forEach((item) => {
      if (
        !item.id &&
        item.specName &&
        item.specValueList.some((row) => row.specValue.trim())
      ) {
        // 自动创建规格
        onAddSku();
      }
      if (
        item.id &&
        item.specValueList.some((row) => row.specValue && !row.id)
      ) {
        // 需要通过请求创建规格值
        const list = item.specValueList
          .filter((row) => !row.id && row.specValue)
          .map((row) => row.specValue);
        addGoodSpecVal(item.id as number, list);
      }
    });
  }
  function check(key: string) {
    let status: ValidateStatus = "";
    let help = "";
    if (key === "goods_sku") {
      for (let i = 0; i < goods_sku.length; i++) {
        // 没有规格名称 但是有规格值
        if (
          !goods_sku[i].specName.trim() &&
          goods_sku[i].specValueList.some((item) => item.specValue.trim())
        ) {
          status = "error";
          help = "请输入规格名称！";
          break;
        }
        // 没有规格值 但是有规格名称
        if (
          goods_sku[i].specValueList.some((item) => !item.specValue.trim()) &&
          goods_sku[i].specName.trim()
        ) {
          status = "error";
          help = "请输入规格值!";
          break;
        }
        // 如果既没有规格名称也没有规格值 那无视
        if (
          !goods_sku[i].specName.trim() &&
          goods_sku[i].specValueList.some((item) => !item.specValue.trim())
        ) {
          status = "success";
          help = "";
        }
      }
      if (!goods_sku.filter((item) => item.id).length) {
        status = "error";
        help = "请输入规格信息！";
      }
    } else if (key === "dataSource") {
      if (!dataSource.length) {
        status = "error";
        help = "请先点击规格创建规格明细";
      }
      // if (dataSource.some((item: any) => !item.skuCode.trim())) {
      //   debugger;
      //   status = "error";
      //   help = "请输入规格编码！";
      // }
    } else if (key === "specPictureReqList") {
      if (!specPictureReqList.length) {
        status = "error";
        help = "请先点击规格创建规格明细";
      }
      if (
        specPictureReqList.some((item) => !item.specPictureValueReqList.length)
      ) {
        status = "error";
        help = "请至少上传一张商品规格图片！";
      }
    }
    setRules((data) => {
      return {
        ...data,
        [key]: status,
        [`${key}_help`]: help,
      };
    });
    if (help) return false;
    else return true;
  }
  // 手动校验
  function validate() {
    return ["goods_sku", "dataSource", "specPictureReqList"].map(check);
  }
  function getOffsetHeight() {
    return skuContext.current?.offsetHeight as number;
  }
  // 拖拽排序图片
  function onDragSortPicture(
    temp: Request.SpecPictureValueReqList[],
    item: Request.SpecPictureReqList & {
      title: string;
    }
  ) {
    const pictureList = _.cloneDeep(specPictureReqList);
    for(let i = 0; i < pictureList.length; i++) {
      if (pictureList[i].title === item.title) {
        pictureList[i].specPictureValueReqList = temp;
        break;
      }
    }
    onChange(data => {
      return {
        ...data,
        specPictureReqList: pictureList
      }
    })
  }

  useImperativeHandle(ref, () => ({
    validate,
    getOffsetHeight,
  }));

  return (
    <div ref={skuContext}>
      <div className="form-group-title">规格信息</div>
      <Form {...formItemLayout}>
        <Item
          label="商品规格"
          required={true}
          className="goods-sku"
          validateStatus={rules.goods_sku}
          help={rules.goods_sku_help}
        >
          <div
            className={`form-sku-ctx ${goods_sku.length && "form-sku-border"}`}
          >
            <SkuContext
              sku={goods_sku}
              addGoodsSpec={addGoodsSpec}
              onChange={onChange}
              updateSpecName={updateSpecName}
              updateSpecValue={updateSpecValue}
              deleteSpec={deleteSpec}
              deleteSpecVal={deleteSpecVal}
              addGoodSpecVal={addGoodSpecVal}
              onMouseLeave={onLeave}
            />
            <Button onClick={onAddSku} style={{ marginBottom: "10px" }}>
              添加规格项目
            </Button>
          </div>
        </Item>
        <Item
          label="规格明细"
          required={false}
          validateStatus={rules.dataSource}
          help={rules.dataSource_help}
        >
          <Table
            dataSource={dataSource}
            pagination={false}
            rowKey={(record) =>
              record.goodsSpec.join(
                `-${Object.keys(record.goodsSpecText).toString()}-`
              )
            }
          >
            {columns.map((item, i) => {
              if (item.dataIndex === "skuCode") {
                return (
                  <Column
                    width={160}
                    key={item.dataIndex}
                    {...item}
                    render={(skuCode: string, record: any) => (
                      <TableInput
                        target={skuCode}
                        record={record}
                        onChange={onChangeText}
                      />
                    )}
                  />
                );
              } else return <Column key={item.dataIndex} {...item} />;
            })}
          </Table>
        </Item>
        <Item
          label="规格图片"
          required={true}
          validateStatus={rules.specPictureReqList}
          help={rules.specPictureReqList_help}
        >
          <div className="sku-pictures">
            <div className="descript">
              仅支持在第一个规格上传图片，每个规格值最多上传8张，建议尺寸：800*800px，图片格式：png、jepg
            </div>
            <div className="sku-pictures-ctx">
              {specPictureReqList.map((item, i) => {
                return (
                  <div
                    className="sku-pictures-ctx-item"
                    key={`${item.title}-${item.specId}-${i}`}
                  >
                    <div className="sku-pictures-ctx-item-title">
                      {item.title}
                    </div>
                    {/* <Uploads
                      showUploadList={false}
                      accept={["image/png", "image/jpeg"]}
                      maxCount={8}
                      size={"1200*1200"}
                      defaultList={item.specPictureValueReqList}
                      onUploads={(img) => onUploads(img, i)}
                      onRemove={(index) => onRemoveUpload(i, index)}
                    /> */}

                    <DragAbleUploadListItem
                      resource={item.specPictureValueReqList}
                      maxCount={8}
                      size={"1200*1200"}
                      accept={["image/png", "image/jpeg"]}
                      onDragSort={(temp) => onDragSortPicture(temp, item)}
                      onUploads={(img) => onUploads(img, i)}
                      onRemove={(index) => onRemoveUpload(i, index)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Item>
      </Form>
    </div>
  );
};

type TableInput = {
  target: string;
  record: any;
  onChange: (text: string, i: number) => void;
};
function TableInput(props: TableInput) {
  const { target, record, onChange } = props;
  const [val, setVal] = useState("");
  const onInput = (text: string) => {
    setVal(text);
  };
  const onBlur = () => {
    onChange(val, record);
  };
  useEffect(() => {
    if (target) setVal(target);
    else setVal("");
  }, []);
  return (
    <Input
      value={val}
      onChange={(e) => onInput(e.target.value)}
      onBlur={onBlur}
      placeholder="输入规格编码"
      maxLength={30}
      onMouseLeave={(e) =>
        onInput((e.target as EventTarget & HTMLInputElement).value)
      }
    />
  );
}

export default forwardRef(SkuInfoData);
