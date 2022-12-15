declare namespace Request {
  type Response = {
    data: unknown;
    msg: string;
    code: number | string;
    total?: number
  }
  type UserInfo = {
    name: string;
    userName: string
  }
  type AddGoodsCategoryParmas = {
    catName: string;
    id?: number;
    level: string;
    overseas: number;
    pid: number;
    seoDescription: string;
    seoKeywords: string;
    seoTitle: string;
    showCategory: string;
    showCategoryImg: string;
    showNav: string;
    showNavImg: string;
    sort: number;
    status: string;
  }
  interface CategoryTree {
    catName: string;
    children?: CategoryTree[];
    createTime: string;
    id: number;
    level: number;
    pid: number;
    seoDescription: string;
    seoKeywords: string;
    seoTitle: string;
    showCategory: 0 | 1;
    showCategoryImg: string;
    showNav: 0 | 1;
    showNavImg: string;
    sort: number;
    status: 0 | 2 | 3;
    updateTime: string
  }
  type GoodsListParams = {
    categoryId: number;
    createTimeEnd: string;
    createTimeStart: string;
    goodsName: string;
    limit: number;
    offset: number;
    sort: number;
    spuCode: string
  }
  interface GoodsList {
    goodsDetail: string;
    goodsName: string;
    goodsSpecPictureList: GoodsSpecPictureList[];
    id: number;
    overseas: 0 | 1;
    productDescription: string;
    salesPrice: number;
    seoDescription: string;
    seoKeywords: string;
    seoTitle: string;
    sort: number;
    spuCode: string;
    createTime: number
  }
  interface GoodsSpecPictureList {
    createTime: number;
    goodsPicture: string;
    id: number
    isDelete: 0 | 1;
    specId: number;
    specValueId: number;
    spuId: number;
  }
  interface AddGoodsParmas {
    goodsSkuReqList: GoodsSkuReqList[];
    goodsSpuReq: GoodsSpuReq;
    specIdList: number[];
    specPictureReqList: SpecPictureReqList[]
  }
  interface GoodsSkuReqList {
    goodsSpec: number[];
    goodsSpecIdList: any;
    goodsSpecText: string;
    id?: number;
    salesPriceSku: number;
    skuCode: string;
    spuId?: number
  }
  interface GoodsSpuReq {
    categoryIdList: number[];
    categoryNameList: string;
    goodsAttrRes: GoodsAttrRes[];
    goodsDetail: string;
    goodsName: string;
    id?: number;
    isShow?: 0 | 1;
    overseas: 0 | 1;
    productDescription: string;
    salesPrice?: number;
    seoDescription: string;
    seoKeywords: string;
    seoTitle: string;
    sort: number;
    spuCode: string;
  }
  interface GoodsAttrRes {
    attrName: string;
    attrValue: string;
    attrValueId: number;
    categoryAttrId: number;
  }
  interface SpecPictureReqList {
    specId: number;
    specValueId: number;
    specPictureValueReqList: SpecPictureValueReqList[]
  }
  interface SpecPictureValueReqList {
    goodsPicture: string;
    id?: number
  }
  interface GoodsDetail {
    goodsSkuResList: GoodsSkuResList[];
    goodsSpecResList: GoodsSpec[];
    goodsSpuRes: GoodsSpuRes;
    specPictureReqList: SpecPictureResList[];
  }
  interface GoodsSpuRes {
    categoryAttrJson: string;
    categoryNameList: string;
    // goodsAttrRes: GoodsAttrRes[];
    goodsDetail: string;
    goodsName: string;
    id: number;
    // isShow?: 0 | 1;
    overseas: 0 | 1;
    productDescription: string;
    salesPrice?: number;
    seoDescription: string;
    seoKeywords: string;
    seoTitle: string;
    sort: number;
    spuCode: string;
  }
  interface SpecPictureResList {
    specId: number;
    specValueId: number;
    specPictureValueResList: SpecPictureValueReqList[]
  }
  interface GoodsSkuResList {
    goodsSpec: string;
    goodsSpecIdList: string;
    goodsSpecText: string;
    id: number;
    salesPriceSku: number;
    skuCode: string;
    spuId: number
  }
  /**
   * 添加商品规格
   */
  interface AddGoodsSpec {
    id?: number;
    specName: string;
    specValue: string[]
  }
  interface GoodsSpec {
    id?: number;
    specName: string;
    specValueList: SpecValueList[]
  }
  interface SpecValueList {
    specValue: string;
    specNameId?: number;
    id?: number
  }
  interface GoodsCategoryAttrList {
    attrName: string;
    categoryAttrId: number;
    categoryId: number;
    isDelete: 0 | 1;
    sort: number;
    categoryAttrValueResList: CategoryAttrValueResList[];
    groupTip: 0 | 1
  }
  interface CategoryAttrValueResList {
    attrValue: string;
    attrValueId?: number;
    categoryAttrId?: number;
    isDelete?: 0 | 1;
  }
  interface GoodsAttrRes {
    attrName: string;
    attrValue: string;
    attrValueId: number;
    categoryAttrId: number
  }
  interface AddGoodsCategoryAttrParams {
    attrName: string;
    attrValueList: string[];
    categoryId: number;
    groupTip: number
  }
  interface UpdateGoodsCategoryAttrParams {
    attrName: string;
    categoryAttrValueList: CategoryAttrValueResList[];
    categoryAttrId: number
  }
  interface RequestCatNameTreeData {
    catName: string;
    id: number;
    level: number;
    pid: number
  }
}