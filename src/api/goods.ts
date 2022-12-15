import axios from "utils/index";
import { Key } from 'react'

export const addGoodsCategory = (
  data: Partial<Request.AddGoodsCategoryParmas>
) => {
  return axios.request({
    url: "/api/admin/category/addGoodsCategory",
    method: "post",
    data,
  });
};
// 修改商品分类
export const setGoodsCategory = (
  data: Partial<Request.AddGoodsCategoryParmas>
) => {
  return axios.request({
    url: "/api/admin/category/updateGoodsCategory",
    method: "post",
    data,
  });
};
// 查询商品分类树
export const goodsCategoryTree = () => {
  return axios.request({
    url: "/api/admin/category/selectGoodsCategoryTree",
    method: "post",
  });
};
// 删除商品分类
export const deleteGoodsTree = (id: number) => {
  return axios.request({
    url: '/api/admin/category/deleteGoodsCategory',
    method: 'post',
    data: {id}
  })
}

// 分页获取未关联任何分类商品列表
export const goodsListNotCategory = (
  goodsName: string,
  offset = 1,
  limit = 10
) => {
  return axios.request({
    url: "/api/admin/category/selectGoodsListNoCategory",
    method: "post",
    data: { goodsName, offset, limit },
  });
};
// 分类关联商品
export const goodsCategoryConnect = (
  categoryId: number,
  spuIdList: Key[]
) => {
  return axios.request({
    url: "/api/admin/category/categoryConnectGoods",
    method: "post",
    data: {
      categoryId,
      spuIdList,
    },
  });
};
// 移除分类关联商品
export const deleteConnectGoods = (categoryId: number, spuId: number) => {
  return axios.request({
    url: '/api/admin/category/removeCategoryConnectGoods',
    method: 'post',
    data: {
      categoryId,
      spuId
    }
  })
}

// 分页获取商品分类属性列表
export const goodsCategoryList = (
  categoryId: number,
  offset?: number,
  limit?: number
) => {
  return axios.request({
    url: "/api/admin/categoryAttr/selectGoodsCategoryAttrList",
    method: "post",
    data: { categoryId, offset, limit },
  });
};
// 添加商品分类属性
export const addGoodsCategoryAttr = (
  data: Request.AddGoodsCategoryAttrParams
) => {
  return axios.request({
    url: "/api/admin/categoryAttr/addGoodsCategoryAttr",
    method: "post",
    data,
  });
};
// 修改商品分类属性
export const updateGoodsCategoryAttr = (
  data: Request.UpdateGoodsCategoryAttrParams
) => {
  return axios.request({
    url: "/api/admin/categoryAttr/updateGoodsCategoryAttr",
    method: "post",
    data,
  });
};
// 删除商品分类属性
export const deleteGoodsCategoryAttr = (categoryAttrId: number) => {
  return axios.request({
    url: "/api/admin/categoryAttr/deleteGoodsCategoryAttr",
    method: "post",
    data: { categoryAttrId },
  });
};
// 删除分类属性值
export const deleteGoodsCategoryAttrVal = (attrValueId: number) => {
  return axios.request({
    url: '/api/admin/categoryAttrValue/deleteCategoryAttrValue',
    method: 'post',
    data: {
      attrValueId
    }
  })
}

// 分页获取商品列表
export const getGoodsList = (data: Partial<Request.GoodsListParams>) => {
  return axios.request({
    url: "/api/admin/goods/selectGoodsCategoryAttrList",
    method: "post",
    data,
  });
};
// 添加商品
export const addGoods = (data: Request.AddGoodsParmas) => {
  return axios.request({
    url: "/api/admin/goods/addGoodsInfo",
    method: "post",
    data,
  });
};
// 添加商品规格
export const addGoodsSpec = (data: Request.AddGoodsSpec) => {
  return axios.request({
    url: '/api/admin/goods/addGoodsSpec',
    method: 'post',
    data
  })
}
// 添加商品规格值
export const addGoodsSpecVal = (id: number, specValue: string[]) => {
  return axios.request({
    url: '/api/admin/goods/addGoodsSpecValue',
    method: 'post',
    data: {
      id, specValue
    }
  })
}
// 修改规格名
export const updateGoodsSpecName = (id: number, specName: string) => {
  return axios.request({
    url: '/api/admin/goods/updateGoodsSpecName',
    method: 'post',
    data: {
      id,
      specName
    }
  })
}
// 修改规格值
export const updateGoodsSpecVal = (id: number, specValue: string) => {
  return axios.request({
    url: '/api/admin/goods/updateGoodsSpecValue',
    method: 'post',
    data: {
      id,
      specValue
    }
  })
}
// 根据商品规格ID删除商品规格
export const deleteGoodsSpec = (id: number) => {
  return axios.request({
    url: '/api/admin/goods/deleteGoodsSpec',
    method: 'post',
    data: {
      id
    }
  })
}
// 根据商品规格值ID删除商品规格值
export const deleteGoodsSpecval = (id: number) => {
  return axios.request({
    url: '/api/admin/goods/deleteGoodsSpecValue',
    method: 'post',
    data: {
      id
    }
  })
}
// 分类级别下拉框信息
export const getOptionCatName = () => {
  return axios.request({
    url: '/api/admin/goods/optionCatName',
    method: 'get'
  })
}
// 删除商品
export const deleteGoods = (spuIdList: number[]) => {
  return axios.request({
    url: '/api/admin/goods/deleteGoodsInfo',
    method: 'post',
    data: {
      spuIdList
    }
  })
}
// 修改商品排序值
export const updateGoodsSort = (sort: number, spuId: number) => {
  return axios.request({
    url: '/api/admin/goods/updateGoodsSort',
    method: 'post',
    data: {
      sort,
      spuId
    }
  })
}
// 通过spu_id获取商品修改初始化数据
export const getGoodsInfo = (spuId: number) => {
  return axios.request({
    url: '/api/admin/goods/getGoodsInfoBySpuId',
    method: 'get',
    params: {
      spuId
    }
  })
}
// 修改商品
export const updateGoods = (data: Request.AddGoodsParmas) => {
  return axios.request({
    url: '/api/admin/goods/updateGoodsSpu',
    method: 'post',
    data
  })
}
// 校验排序值是否已经存在 已经存在返回true，否则false
export const checkedSort = (sort: number, spuId?: number) => {
  const data: { sort: number, spuId?: number } = {
    sort
  }
  if (spuId) {
    data.spuId = spuId
  }
  return axios.request({
    url: '/api/admin/goods/checkSortValue',
    method: 'post',
    data
  })
}
// 校验分类属性值是否已经被使用 已经使用返回true，否则false
export const checkAttrUsed = (attrValueId: number) => {
  return axios.request({
    url: '/api/admin/categoryAttrValue/checkSortValue',
    method: 'post',
    data: {
      attrValueId
    }
  })
}