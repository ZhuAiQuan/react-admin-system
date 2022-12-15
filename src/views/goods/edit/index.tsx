import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Segmented, Button, Space, message, Popconfirm, Form } from "antd";
import BasicInfo from "./basicInfo";
import SkuInfo from "./skuInfo";
import MyEditor from "_c/editor";
import GoodSeo from "./seo";
import TopTabs from "./top";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hook";
import {
  getOptionCatName,
  goodsCategoryList,
  addGoodsSpec,
  updateGoodsSpecName,
  updateGoodsSpecVal,
  deleteGoodsSpec,
  deleteGoodsSpecval,
  addGoodsSpecVal,
  addGoods,
  getGoodsInfo,
  updateGoods,
  checkedSort,
} from "api/goods";
import { setFlatToTree, descartes } from "utils/tools";
import * as _ from "lodash";
import "./index.less";

const options = [
  {
    label: "基础信息",
    value: "basic_info",
  },
  {
    label: "规格信息",
    value: "sku_info",
  },
  {
    label: "商品详情",
    value: "goods_info",
  },
  {
    label: "SEO",
    value: "seo",
  },
];
const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    lg: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 24 },
    lg: { span: 12 },
  },
};
type ValidateStatus = Parameters<typeof Form.Item>[0]["validateStatus"];
export type Options = typeof options;
export type FormItemLayout = typeof formItemLayout;
export type BasicInfo = {
  goodsName: string;
  spuCode: string;
  sort: number | undefined;
  productDescription: string;
  categoryIdList: number[];
  categoryNameList: Request.RequestCatNameTreeData[];
  goodsAttrRes: Request.GoodsAttrRes[];
  goodsAttrIdList: number[];
};
export type SkuInfo = {
  goods_sku: Request.GoodsSpec[];
  dataSource: DataSource[] & any[];
  columns: any[];
  specPictureReqList: (Request.SpecPictureReqList & { title: string })[];
};
export type CreateSku = {
  title: string;
  children: string[];
};
export type SeoInfo = {
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
};
export type Configs = {
  catNameOptions: (Request.RequestCatNameTreeData & {
    children?: Request.RequestCatNameTreeData[];
  })[];
  catAttrOptions: Request.GoodsCategoryAttrList[];
};
export type DataSource = {
  goodsSpec: number[];
  skuCode: string;
  id?: number;
  spuId?: number;
  goodsSpecIdList: any;
  goodsSpecText: any;
};
export type BasicImpHandle = {
  scrollTop: number;
  validate: () => boolean[];
  validateSort: (type: ValidateStatus, sort_help: string) => void;
  clearFormValidate: (key: string) => void
};
export type SkuInfoImpHandle = {
  validate: () => boolean[];
  getOffsetHeight: () => number;
};
export type SeoImpHandle = {
  validate: () => boolean[];
};
export type DetailHandle = {
  getOffsetHeight: () => number;
  getContext: () => string;
};

export default function index() {
  const { id } = useParams();
  const { type } = useAppSelector((state) => state.global);
  const basicRef = useRef<BasicImpHandle | null>(null);
  const seoRef = useRef<SeoImpHandle | null>(null);
  const skuRef = useRef<SkuInfoImpHandle | null>(null);
  const detailRef = useRef<DetailHandle | null>(null);
  const context = useRef<HTMLDivElement | null>(null);
  const [attrCheckNeed, changeAttrNeedState] = useState(true);
  const localtion = useNavigate();
  // mode true是编辑模式 false则是新增模式
  const mode = !!Number(id as string);
  const [segValue, changeSegment] = useState("basic_info");
  // 基础信息
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    categoryIdList: [],
    goodsName: "",
    spuCode: "",
    sort: undefined,
    productDescription: "",
    categoryNameList: [],
    goodsAttrRes: [],
    goodsAttrIdList: [],
  });
  // sku信息
  const [skuInfo, setSkuInfo] = useState<SkuInfo>({
    goods_sku: [
      {
        specName: "",
        specValueList: [{ specValue: "" }],
      },
    ],
    dataSource: [],
    columns: [],
    specPictureReqList: [],
  });
  // 商品详情
  const [goodsDetail, setGoodsInfo] = useState("");
  // seo
  const [seoInfo, setSeoInfo] = useState<SeoInfo>({
    seoTitle: "",
    seoKeywords: "",
    seoDescription: "",
  });
  // 配置项数据
  const [configs, setConfig] = useState<Configs>({
    catNameOptions: [],
    catAttrOptions: [],
  });
  // 提交
  function onSubmit(state: boolean) {
    // 触发基础信息表单的校验
    let validateState: boolean[] = [];
    validateState = (basicRef.current as BasicImpHandle).validate();
    if (validateState.some((type) => !type)) {
      changeSeg("basic_info");
      return;
    }
    validateState = (skuRef.current as SeoImpHandle).validate();
    if (validateState.some((type) => !type)) {
      changeSeg("sku_info");
      return;
    }
    validateState = (seoRef.current as SkuInfoImpHandle).validate();
    if (validateState.some((type) => !type)) {
      changeSeg("seo");
      return;
    }
    const { specPictureReqList, dataSource, goods_sku } = _.clone(skuInfo);
    const goodsSkuReqList = dataSource.map((item: any) => {
      const obj: any = {};
      if (!state) {
        obj.id = item.id;
        obj.spuId = item.spuId;
      }
      return {
        goodsSpec: item.goodsSpec,
        goodsSpecIdList: item.goodsSpecIdList,
        goodsSpecText: item.goodsSpecText,
        skuCode: item.skuCode,
        ...obj,
      };
    });
    // 组合数据
    const params = {
      specPictureReqList: specPictureReqList,
      goodsSpuReq: Object.assign(basicInfo, seoInfo, {
        overseas: type,
        goodsDetail: (detailRef.current as DetailHandle).getContext(),
      }),
      goodsSkuReqList,
      specIdList: goods_sku
        .filter((item) => item.id)
        .map((item) => item.id) as number[],
    };
    if (state) {
      // 新增
      addGoods(params as any).then((res) => {
        const { code, msg } = res.data;
        if (+code) {
          message.error(msg);
        } else {
          localtion("/goods/list", {
            replace: true,
          });
        }
      });
    } else {
      // 编辑
      (params.goodsSpuReq as any).id = Number(id);
      updateGoods(params as any).then((res) => {
        const { code, msg } = res.data;
        if (+code) {
          message.error(msg);
        } else {
          localtion("/goods/list", {
            replace: true,
          });
        }
      });
    }
  }
  // 校验基础属性页面
  function checkBasic() {
    if (
      basicInfo.goodsName.trim() &&
      (basicInfo.sort || basicInfo.sort === 0) &&
      basicInfo.goodsAttrIdList.length
    )
      if (configs.catNameOptions.length && !configs.catAttrOptions.length) return true
      else {
        return !!basicInfo.categoryIdList.length
      }
    else return false;
  }
  // 校验规格页面
  function checkSku() {
    const validateState: boolean[] = [];
    validateState.push(
      skuInfo.goods_sku
        .filter((item) => item.id)
        .some((item) =>
          item.specValueList.some(
            (row) => row.id || item.specValueList.some((row) => row.specValue)
          )
        )
    );
    validateState.push(skuInfo.dataSource.some((item: any) => item.skuCode));
    validateState.push(
      skuInfo.specPictureReqList.some(
        (item) => item.specPictureValueReqList.length
      )
    );
    if (validateState.some((item) => !item)) return false;
    else return true;
  }
  // 校验seo页面
  function checkSeo() {
    if (
      seoInfo.seoTitle.trim() &&
      seoInfo.seoKeywords.trim() &&
      seoInfo.seoDescription.trim()
    ) {
      return true;
    }
  }
  // 取消
  function onCancel() {
    localtion("/goods/list", {
      replace: true,
    });
  }
  // 获取分类下拉框数据
  function getCatNameInSelect() {
    // 如果已有数据 则不再请求
    if (configs.catNameOptions.length) return;
    getOptionCatName().then((res) => {
      const { data, code, msg } = res.data;
      if (+code) {
        message.error(msg);
        setConfig((data) => ({ ...data, catNameOptions: [] }));
      } else {
        const catNameOptions = setFlatToTree(
          data as Request.RequestCatNameTreeData[]
        );
        setConfig((data) => ({ ...data, catNameOptions }));
        (basicRef.current as BasicImpHandle).clearFormValidate('goodsAttrIdList');
      }
    });
  }
  // 根据选中的分类来获取对应的属性值
  function getAttrOptions(
    id = basicInfo.categoryIdList.at(-1) as number,
    type = true,
    list: Request.GoodsAttrRes[] = []
  ) {
    (basicRef.current as BasicImpHandle).clearFormValidate('categoryIdList');
    (basicRef.current as BasicImpHandle).clearFormValidate('goodsAttrIdList');
    if (type) {
      setConfig((data) => ({ ...data, catAttrOptions: [] }));
    }

    goodsCategoryList(id).then((res) => {
      const { code, data, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        const catAttrOptions = (data as Request.GoodsCategoryAttrList[]).map(
          (item) => {
            return {
              ...item,
            };
          }
        );
        const goodsAttrRes = Array(catAttrOptions.length).fill(
          new Object({
            attrValue: "",
            attrValueId: 0,
            categoryAttrId: 0,
            attrName: "",
          })
        );
        let goodsAttrIdList = Array(catAttrOptions.length).fill(-1);
        if (!type && list.length) {
          // 草率了 不能相信后端传过来的数据，有些数据都被删除了还记录在商品spu里
          // goodsAttrRes = list;
          // goodsAttrIdList = list.map((item) => item.attrValueId);
          const sourceId = list.map((row) => row.attrValueId).map(Number)
          catAttrOptions.forEach((item, index) => {
            const ids = item.categoryAttrValueResList.map(row => row.attrValueId) as number[];
            if (ids.some(n => sourceId.includes(n))) {
              for(let i = 0; i < ids.length; i++) {
                for(let j = 0; j < sourceId.length; j++) {
                  if (ids[i] === sourceId[j]) {
                    goodsAttrIdList[index] = ids[i];
                    // 偷个懒吧 假设map(Number)后数据是按照源数据排序的话 否则出bug了在这里修改逻辑 手动find item.categoryAttrValueResList去匹配
                    // 偷不了 还搞错了 上才艺 E.G.M
                    goodsAttrRes[index] = list[j]
                    break;
                  }
                }
              }
              
            }
          })
        }
        if (catAttrOptions.length) changeAttrNeedState(true)
        else changeAttrNeedState(false);

        setBasicInfo((data) => {
          return {
            ...data,
            goodsAttrRes,
            goodsAttrIdList,
          };
        });
        setConfig((data) => ({ ...data, catAttrOptions }));
      }
    });
  }
  // 添加规格
  function addGoodSpec(data: Request.GoodsSpec) {
    const specValue = data.specValueList.map((item) => item.specValue);
    addGoodsSpec({ ...data, specValue }).then((res) => {
      const { data, msg, code } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        const goods_sku = data as Request.GoodsSpec;
        const temp = _.cloneDeep(skuInfo);
        const i = temp.goods_sku
          .map((item) => item.specName)
          .indexOf(goods_sku.specName);
        temp.goods_sku.splice(i, 1, goods_sku);
        // if (temp.goods_sku.length < 5) {
        //   temp.goods_sku.push({
        //     specName: "",
        //     specValueList: [{ specValue: "" }],
        //   });
        // }
        setSkuInfo(temp);
        createSkuDetail(temp.goods_sku, skuInfo.dataSource);
        createSkuPicture(temp.goods_sku, (skuInfo.specPictureReqList).map(item => ({...item, specPictureValueResList: item.specPictureValueReqList })));
      }
    });
  }
  // 添加规格值
  function addGoodSpecVal(id: number, list: string[]) {
    addGoodsSpecVal(id, list).then((res) => {
      const { code, msg, data } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        const temp = data as Request.SpecValueList[];
        const { goods_sku, specPictureReqList, dataSource } = _.cloneDeep(skuInfo);
        let changeSkuPicture = false;
        for (let i = 0; i < goods_sku.length; i++) {
          if (goods_sku[i].id === id) {
            if (!i) {
              changeSkuPicture = true;
            }

            temp.forEach((item) => {
              for (let j = 0; j < goods_sku[i].specValueList.length; j++) {
                if (
                  goods_sku[i].specValueList[j].specValue === item.specValue &&
                  !goods_sku[i].specValueList[j].id
                ) {
                  goods_sku[i].specValueList[j] = Object.assign(
                    goods_sku[i].specValueList[j],
                    item
                  );
                }
              }
            });
            //   goods_sku[i].specValueList.push(...list.map(row => ({specValue: row})));
            break;
          }
        }
        if (changeSkuPicture) {
          const title = specPictureReqList[0].title.split("-")[0];
          const specPictureValueReqList: SkuInfo["specPictureReqList"] =
            temp.map((item) => {
              return {
                title: `${title}-${item.specValue}`,
                specId: id,
                specValueId: item.id as number,
                specPictureValueReqList: [],
              };
            });
          specPictureReqList.push(...specPictureValueReqList);
        }
        createSkuDetail(goods_sku, dataSource);
        setSkuInfo((data) => ({ ...data, goods_sku, specPictureReqList }));
      }
    });
  }
  // 创建规格明细
  function createSkuDetail(
    goods_sku: Request.GoodsSpec[],
    rest: SkuInfo["dataSource"] = []
  ) {
    // 规格明细长度
    goods_sku = goods_sku.filter((item) => item.specName.trim());
    if (goods_sku.length) {
      const len = goods_sku
        .map((item) => item.specValueList.length || 1)
        .reduce((pre, next) => pre * next);
      const list = goods_sku.map((item) =>
        item.specValueList.map((item) => item.specValue)
      );
      const result = descartes(list);
      const dataSource = Array(len)
        .fill(new Object())
        .map((_, i) => {
          const obj: DataSource & any = {
            skuCode: "",
            goodsSpec: [],
            goodsSpecIdList: {},
            goodsSpecText: {},
          };
          for (let _i = 0; _i < result[i].length; _i++) {
            const specValue = result[i][_i];
            searchSpecId(specValue, goods_sku, obj);
          }
          obj.goodsSpec = Object.values(obj.goodsSpecIdList);
          if (rest.length) {
            const data = rest.filter(
              (item) =>
                Object.values(item.goodsSpecIdList).toString() ===
                  Object.values(obj.goodsSpecIdList).toString() &&
                Object.keys(item.goodsSpecText).toString() ===
                  Object.keys(obj.goodsSpecText).toString()
            );
            Object.assign(obj, data[0]);
          }
          return obj;
        });
      const columns = goods_sku
        .map((item) => {
          return {
            title: item.specName,
            dataIndex: item.specName,
          };
        })
        .concat({
          title: "规格编码",
          dataIndex: "skuCode",
        });
      setSkuInfo((data) => {
        return {
          ...data,
          dataSource,
          columns,
        };
      });
    } else {
      setSkuInfo((data) => {
        return {
          ...data,
          columns: [],
          dataSource: [],
        };
      });
    }
  }
  // 根据规格值找对应的规格Id
  function searchSpecId(
    specValue: string,
    goods_sku: Request.GoodsSpec[],
    obj: any
  ) {
    goods_sku.forEach((item) => {
      const temp = item.specValueList.find(
        (row) => row.specValue === specValue
      );
      if (temp) {
        const { specName } = item;
        const { specNameId, id } = temp;
        obj.goodsSpecIdList[specNameId as number] = id;
        obj.goodsSpecText[specName] = specValue;
        obj[specName] = specValue;
      }
    });
  }
  // 创建规格图片
  function createSkuPicture(
    goods_sku: Request.GoodsSpec[],
    picList: Request.SpecPictureResList[] = []
  ) {
    if (!goods_sku.length) return;
    const temp = goods_sku[0] as Request.GoodsSpec;
    const specPictureReqList: SkuInfo["specPictureReqList"] =
      temp.specValueList.map((item) => {
        const { specNameId, id } = item as Required<Request.SpecValueList>;
        let specPictureValueReqList: Request.SpecPictureValueReqList[] = [];
        if (picList.length) {
          const rest = picList.filter(
            (row) => row.specId === specNameId && row.specValueId === id
          );
          if (rest.length) {
            specPictureValueReqList = rest[0].specPictureValueResList;
          }
        }
        return {
          specId: specNameId,
          specValueId: id,
          specPictureValueReqList,
          title: `${temp.specName}-${item.specValue}`,
        };
      });
    setSkuInfo((data) => {
      return {
        ...data,
        specPictureReqList,
      };
    });
  }
  // 修改规格名
  function updateSpecName(id: number, name: string) {
    const { goods_sku } = _.cloneDeep(skuInfo);
    if (goods_sku.filter(item => item.id === id && item.specName === name).length) return
    updateGoodsSpecName(id, name).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        let changeSkuPicture = false;
        let oldSpecName = "";
        const { specPictureReqList, columns, dataSource } =
          _.cloneDeep(skuInfo);
        const goods_sku = skuInfo.goods_sku.map((item, i) => {
          let specName = item.specName;
          if (item.id === id) {
            oldSpecName = specName;
            specName = name;

            if (!i) {
              changeSkuPicture = true;
            }
          }
          return { ...item, specName };
        });
        if (changeSkuPicture) {
          specPictureReqList.forEach((item) => {
            if (item.specId === id) {
              const rest = item.title.split("-")[1];
              item.title = `${name}-${rest}`;
            }
          });
        }
        if (oldSpecName) {
          for (let i = 0; i < columns.length; i++) {
            if (columns[i].title === oldSpecName) {
              columns[i].title = name;
              columns[i].dataIndex = name;
              break;
            }
          }
          dataSource.forEach((item: any) => {
            item[name] = item[oldSpecName];
            item['goodsSpecText'] = {
              ...item['goodsSpecText'],
              [name]: item['goodsSpecText'][oldSpecName]
            }
            delete item[oldSpecName];
            delete item['goodsSpecText'][oldSpecName];
          });
        }
        debugger
        setSkuInfo((data) => {
          return {
            ...data,
            goods_sku,
            specPictureReqList,
            columns,
            dataSource,
          };
        });
      }
    });
  }
  // 修改规格值
  function updateSpecValue(id: number, name: string) {
    updateGoodsSpecVal(id, name).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        const { goods_sku, dataSource, specPictureReqList } =
          _.cloneDeep(skuInfo);
        let oldSpecValue = "";
        let changeSkuPicture = false;
        for (let i = 0; i < goods_sku.length; i++) {
          for (let j = 0; j < goods_sku[i].specValueList.length; j++) {
            if (goods_sku[i].specValueList[j].id === id) {
              oldSpecValue = goods_sku[i].specValueList[j].specValue;
              goods_sku[i].specValueList[j].specValue = name;
              if (!i) {
                changeSkuPicture = true;
              }
              break;
            }
          }
        }
        if (oldSpecValue) {
          dataSource.forEach((item: any) => {
            for (const key in item) {
              let title = "";
              if (item[key] === oldSpecValue) {
                item[key] = name;
                title = key;
              }
              if (key === "goodsSpecText" && title) {
                item[key][title] = name;
              }
            }
          });
        }
        if (changeSkuPicture) {
          specPictureReqList.forEach((item) => {
            const [rest, old] = item.title.split("-");
            if (old === oldSpecValue) {
              item.title = `${rest}-${name}`
            }
            
          });
        }
        setSkuInfo((data) => ({
          ...data,
          goods_sku,
          dataSource,
          specPictureReqList,
        }));
      }
    });
  }
  // 删除规格
  function deleteSpec(i: number, id: number) {
    deleteGoodsSpec(id).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        const { goods_sku, specPictureReqList, dataSource } = _.cloneDeep(skuInfo);
        goods_sku.splice(i, 1);
        if (!i) {
          // 如果是第一项则需要重新创建图片结构
          const temp = specPictureReqList.map(item => {
            return {
              ...item,
              specPictureValueResList: item.specPictureValueReqList
            }
          })
          createSkuPicture(goods_sku, temp);
        }
        // 重新生成新的规格列表
        createSkuDetail(goods_sku, dataSource);
        setSkuInfo((data) => ({ ...data, goods_sku }));
      }
    });
  }
  // 删除规格值
  function deleteSpecVal(i: number, index: number, id: number) {
    deleteGoodsSpecval(id).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        const { goods_sku, specPictureReqList, dataSource } = _.cloneDeep(skuInfo);
        goods_sku[i].specValueList.splice(index, 1);
        if (!i) {
          // 如果是第一项则需要重新创建图片结构
          const temp = specPictureReqList.map(item => {
            return {
              ...item,
              specPictureValueResList: item.specPictureValueReqList
            }
          })
          createSkuPicture(goods_sku, temp);
        }
        // 重新生成新的规格列表
        createSkuDetail(goods_sku, dataSource);
        setSkuInfo((data) => ({ ...data, goods_sku }));
      }
    });
  }
  // 根据商品id获取详情
  function getDetail() {
    getCatNameInSelect();
    getGoodsInfo(+(id as string)).then((res) => {
      const { code, data, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        const {
          goodsSkuResList,
          goodsSpecResList,
          goodsSpuRes,
          specPictureReqList,
        } = data as Request.GoodsDetail;
        const goods_sku = goodsSpecResList.length
          ? goodsSpecResList
          : [
              {
                specName: "",
                specValueList: [{ specValue: "" }],
              },
            ];
        const rest: SkuInfo["dataSource"] = goodsSkuResList.map((item) => {
          return {
            ...item,
            goodsSpec: JSON.parse(item.goodsSpec).map(Number),
            goodsSpecIdList: JSON.parse(item.goodsSpecIdList),
            goodsSpecText: JSON.parse(item.goodsSpecText),
          };
        });
        const {
          goodsName,
          spuCode,
          sort,
          productDescription,
          seoDescription,
          seoKeywords,
          seoTitle,
          goodsDetail,
          categoryAttrJson,
          categoryNameList,
        } = goodsSpuRes;
        const name = categoryNameList
          ? (JSON.parse(categoryNameList) as Request.RequestCatNameTreeData[])
          : [];
        const categoryIdList = name.map((item) => item.id);
        const attr = categoryAttrJson
          ? (JSON.parse(categoryAttrJson) as Request.GoodsAttrRes[])
          : [];
        setBasicInfo((data) => {
          return {
            ...data,
            goodsName,
            spuCode,
            sort,
            productDescription,
            categoryNameList: name,
            categoryIdList,
            goodsAttrRes: attr,
            goodsAttrIdList: attr.map((item) => item.attrValueId),
          };
        });
        setSeoInfo({
          seoDescription,
          seoKeywords,
          seoTitle,
        });
        setGoodsInfo(goodsDetail);
        setSkuInfo((data) => {
          return {
            ...data,
            goods_sku,
          };
        });
        // 创建规格明细
        createSkuDetail(goods_sku, rest);
        // 创建规格图片明细
        createSkuPicture(goods_sku, specPictureReqList);
        // 获取商品属性数据
        getAttrOptions(categoryIdList.at(-1) as number, false, attr);
        // 存储排序值 方便修改排序值时还原
        sessionStorage.setItem('sort', `${goodsSpuRes.sort}`);
      }
    });
  }
  function checkInputSort(sort: number) {
    if (!+sort) {
      return;
    }
    let params;
    if (id && +id) params = +id;
    checkedSort(+sort, params).then((res) => {
      const { code, data, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        if (data as boolean) {
          message.error("排序值已存在！");
          (basicRef.current as BasicImpHandle).validateSort(
            "error",
            "该排序值已存在！"
          );
          if (Number(id) && +(sessionStorage.getItem('sort') as string)) {
            setTimeout(() => {
              (basicRef.current as BasicImpHandle).validateSort(
                "",
                ""
              );
            }, 1000);
          }
          setBasicInfo((data) => {
            return {
              ...data,
              sort: Number(id) ? (+(sessionStorage.getItem('sort') as string) || undefined) : undefined,
            };
          });
        } else {
          (basicRef.current as BasicImpHandle).validateSort("success", "");
        }
      }
    });
  }
  // 监听滚动条 自动切换segValue
  function listenScroll(e: Event) {
    if (e.target instanceof HTMLDivElement) {
      const basicHeight = (basicRef.current as BasicImpHandle).scrollTop;
      const skuHeight = (skuRef.current as SkuInfoImpHandle).getOffsetHeight();
      const editorHeight = (
        detailRef.current as DetailHandle
      ).getOffsetHeight();
      const el = context.current as HTMLDivElement;
      if (e.target.scrollTop <= basicHeight - 100) {
        segValue !== "basic_info" && changeSegment("basic_info");
      } else if (e.target.scrollTop <= basicHeight + skuHeight - 100) {
        segValue !== "sku_info" && changeSegment("sku_info");
      } else if (
        e.target.scrollTop <
        basicHeight + skuHeight + editorHeight - 100
      ) {
        if (
          e.target.scrollHeight - e.target.scrollTop - el.offsetHeight ===
          0
        ) {
          segValue !== "seo" && changeSegment("seo");
        } else segValue !== "goods_info" && changeSegment("goods_info");
      } else {
        segValue !== "seo" && changeSegment("seo");
      }
    }
  }
  // 手动切换segValue
  function changeSeg(key: string) {
    const el = context.current as HTMLDivElement;
    if (key === "basic_info") {
      el.scrollTop = 0;
    } else if (key === "sku_info") {
      const scrollTop = (basicRef.current as BasicImpHandle).scrollTop;
      el.scrollTop = scrollTop;
    } else if (key === "goods_info") {
      const scrollTop =
        (skuRef.current as SkuInfoImpHandle).getOffsetHeight() +
        (basicRef.current as BasicImpHandle).scrollTop -
        30;
      el.scrollTop = scrollTop;
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }

  useEffect(() => {
    if (typeof id === "string" && Number(id)) getDetail();
    return () => {
      sessionStorage.setItem('sort', '')
    }
  }, [id]);

  useEffect(() => {
    const el = context.current as HTMLDivElement;
    // const func = _.debounce(, 300)
    el.addEventListener("scroll", listenScroll);
    return () => {
      el.removeEventListener("scroll", listenScroll);
    };
  }, []);
  return (
    <div className="goods-edit">
      <TopTabs options={options} activedKey={segValue} onChange={changeSeg}>
        {mode ? (
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={() => onSubmit(false)}>
              保存
            </Button>
          </Space>
        ) : (
          <Space>
            <Popconfirm
              title="系统将不保存此条数据，确定取消吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => localtion("/goods/list", { replace: true })}
            >
              <Button>取消</Button>
            </Popconfirm>
            <Button type="primary" onClick={() => onSubmit(true)}>
              发布商品
            </Button>
          </Space>
        )}
      </TopTabs>
      <div className="goods-edit-content" ref={context}>
        <BasicInfo
          {...basicInfo}
          onChange={setBasicInfo}
          formItemLayout={formItemLayout}
          minIndex={0}
          catNameOptions={configs.catNameOptions}
          catAttrOptions={configs.catAttrOptions}
          attrState={attrCheckNeed}
          getOptionCatName={getCatNameInSelect}
          getOptionsAttr={getAttrOptions}
          ref={basicRef}
          checkSort={checkInputSort}
        />
        <SkuInfo
          {...skuInfo}
          onChange={setSkuInfo}
          updateSpecName={updateSpecName}
          formItemLayout={formItemLayout}
          addGoodsSpec={addGoodSpec}
          updateSpecValue={updateSpecValue}
          deleteSpec={deleteSpec}
          deleteSpecVal={deleteSpecVal}
          addGoodSpecVal={addGoodSpecVal}
          ref={skuRef}
        />
        <>
          <div className="form-group-title" style={{ paddingBottom: "30px" }}>
            商品详情
          </div>
          <MyEditor text={goodsDetail} getText={setGoodsInfo} ref={detailRef} />
        </>

        <GoodSeo
          formItemLayout={formItemLayout}
          {...seoInfo}
          onChange={setSeoInfo}
          ref={seoRef}
        />
      </div>
    </div>
  );
}
