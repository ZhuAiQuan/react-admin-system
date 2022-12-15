import { useState, useEffect, useRef, MutableRefObject, Key, useMemo } from 'react';
import { Input, Tabs, message, notification, Button, Tooltip, Space } from "antd";
import TreeData from "./tree";
import type { DataNode, TreeProps } from "antd/es/tree";
import GoodsList from "./goods";
import CategorySetting from "./setting";
import CategoryAttr from "./attr";
import {
  goodsCategoryTree,
  goodsCategoryConnect,
  goodsListNotCategory,
  goodsCategoryList,
  addGoodsCategoryAttr,
  updateGoodsCategoryAttr,
  deleteGoodsCategoryAttr,
  deleteGoodsCategoryAttrVal,
  deleteGoodsTree,
  getGoodsList,
  deleteConnectGoods,
  updateGoodsSort,
  checkAttrUsed,
} from "api/goods";
import { useAppSelector } from "@/store/hook";
import * as _ from "lodash";
import type { TablePaginationConfig } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import Dialog from '_c/modal';
import "./index.less";

type TabsKey = "goods" | "setting" | "attr";
export interface Target {
  title: string;
  id: number;
  fTitle: string;
  pid: number;
  type: number;
  temp?: Partial<Request.CategoryTree>;
  level: number
}
export interface CategoryState {
  status: "add" | "edit";
}
export type AttrData = {
  data: Request.GoodsCategoryAttrList[];
  limit: number;
  offset: number;
  total: number;
};
export type GoodsListInfo = {
  data: Request.GoodsList[];
  total: number;
  offset: number;
  limit: number;
  goodsName: string;
};
export type NotConnectGoodsInfo = {
  selectList: Key[];
};
type DialogOptions = {
  visible: boolean,
  title: string;
}

const { Search } = Input;
const { TabPane } = Tabs;
const tabs = [
  {
    tab: "关联商品",
    key: "goods",
  },
  {
    tab: "分类设置",
    key: "setting",
  },
  {
    tab: "分类属性",
    key: "attr",
  },
];
export default function index() {
  // 国内或则海外
  const { type } = useAppSelector((state) => state.global);
  // 新增或者编辑状态
  const [cateState, setCateState] = useState<CategoryState>({
    status: "add",
  });
  const [tree, setTreeData] = useState<DataNode[]>([]);
  const [sourceTree, treeData] = useState<DataNode[]>([]);
  // 选中树的数据
  const [target, setData] = useState<Target>({
    title: "",
    id: 0,
    fTitle: "根节点",
    pid: 0,
    type,
    level: 0
  });
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  // 关联商品列表数据
  const [goodsListInfo, setList] = useState<GoodsListInfo>({
    data: [],
    total: 0,
    offset: 0,
    limit: 10,
    goodsName: "",
  });
  // 未关联商品列表数据
  const [notConnectGoodsList, setNotConnectList] = useState<
    GoodsListInfo & NotConnectGoodsInfo
  >({
    data: [],
    total: 0,
    offset: 0,
    limit: 10,
    goodsName: "",
    selectList: [],
  });

  const [tabsKey, setTabsKey] = useState<TabsKey>("setting");

  const [attrData, setAttrData] = useState<AttrData>({
    data: [],
    limit: 10,
    offset: 0,
    total: 0,
  });
  const [dialog, setState] = useState<DialogOptions>({
    visible: false,
    title: '新增一级分类'
  })

  const categoryAttr = useRef<MutableRefObject<HTMLDivElement> | null>(null);
  const goodsContext = useRef(null);
  const settingContext = useRef(null);
  const tabs = useMemo(() => {
    if (target.level) {
      if (target.level === 1) {
        setTabsKey("setting")
        return [
          {
            tab: "分类设置",
            key: "setting",
          }
        ]
      } else {
        return [
          {
            tab: "关联商品",
            key: "goods",
          },
          {
            tab: "分类设置",
            key: "setting",
          },
          {
            tab: "分类属性",
            key: "attr",
          },
        ]
      }
    } else return []
  }, [target.level])
  // 组件
  const components = {
    goods: (
      <GoodsList
        {...target}
        getNotCategory={notCategory}
        {...goodsListInfo}
        notConnectGoodsList={notConnectGoodsList}
        onChange={setList}
        onSortTable={onSortTable}
        onDelTableData={onDelTableData}
        getData={goodsList}
        tableChange={connectGoodsListPagition}
        onChangeDrawerTable={setNotConnectList}
        onConnectGoods={connectGoods}
        ref={goodsContext}
      />
    ),
    setting: (
      <CategorySetting {...target} {...cateState} getTree={checkedTab} ref={settingContext} onCloseModal={onCancel} />
    ),
    attr: (
      <CategoryAttr
        {...attrData}
        addGoodsAttr={addGoodsAttr}
        updateGoodsAttr={updateGoodsAttr}
        deleteGoodsAttr={deleteGoodsAttr}
        deleteGoodsAttrVal={deleteGoodsAttrVal}
        onChange={setAttrData}
        tableChange={attrTableChange}
        ref={categoryAttr}
      />
    ),
  };

  // 树过滤
  const onSearchCate = (value: string) => {
    const temp = _.cloneDeep(sourceTree);
    if (value) {
      let data: DataNode[] & Partial<Request.CategoryTree>[] = [];
      onFilter(
        value,
        temp as DataNode[] & Partial<Request.CategoryTree>[],
        data
      );
      setTreeData(data);
    } else setTreeData(temp);
  };
  // 选中树
  const onSelectTree: TreeProps["onSelect"] = (selectedKeys, info) => {
    setCateState((data) => ({ ...data, status: "edit" }));
    const {
      catName,
      children,
      id,
      pid,
      level,
      showCategory,
      showCategoryImg,
      showNav,
      showNavImg,
    } = info.node as DataNode & Partial<Request.CategoryTree>;
    let fTitle = target.fTitle;
    let title = target.title;
    if (level && level === 1 && children) {
      fTitle = catName as string;
      title = "";
    } else {
      title = catName as string;
    }
    setData((data) => ({
      ...data,
      fTitle,
      title,
      id: id as number,
      pid: pid as number,
      temp: {
        showCategory,
        showCategoryImg,
        showNav,
        showNavImg,
        catName,
      },
      level: level as number
    }));
    // request data
    requestTabKey(tabsKey, id as number);
  };
  // 展开树
  const onExpand = (expandedKeysValue: React.Key[]) => {
    if (expandedKeysValue.length) {
      setCateState((data) => ({ ...data, status: "edit" }));
      const id = expandedKeysValue.at(-1);
      const item = tree.find(
        (item) => (item as DataNode & Partial<Request.CategoryTree>).id === id
      );
      const {
        catName,
        id: nid,
        level,
        showNav,
        showNavImg,
        pid
      } = item as DataNode & Partial<Request.CategoryTree>;
      // 1级分类 获取其id和title 并清空二级缓存
      if (level === 1)
        setData((data) => ({
          ...data,
          fTitle: catName as string,
          pid: pid as number,
          title: '',
          id: nid as number,
          level,
          temp: {
            showNav,
            showNavImg,
            catName
          }
        }));
    }
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const footer = (
    <div style={{ textAlign: "center" }}>
      <Space>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={onSubmit}>
          确认
        </Button>
      </Space>
    </div>
  );

  // 获取树数据
  function getTree() {
    goodsCategoryTree().then((res) => {
      const { code, data, msg } = res.data;
      if (!+code) {
        setTreeData(data as DataNode[]);
        treeData(data as DataNode[]);
      } else {
        setTreeData([]);
        treeData([]);
        ![1001, 1002, 1003].includes(+code) && message.error(msg);
      }
      if (!(data as unknown[]).length) {
        notification.open({
          message: "提示信息",
          description: "当前暂无分类信息，请先添加分类树数据！",
        });
        setTabsKey("setting");
      }
    });
  }
  // 添加树分类
  function onAddTree(data: DataNode & Partial<Request.CategoryTree>) {
    setCateState((data) => ({ ...data, status: "add" }));
    setTabsKey("setting");
    const { catName, id, showCategory, showCategoryImg, showNav, showNavImg, level } =
      data;
    setData((data) => ({
      ...data,
      fTitle: catName as string,
      pid: id as number,
      id: id as number,
      temp: {
        showCategory,
        showCategoryImg,
        showNav,
        showNavImg,
        catName,
      },
      level: level as number
    }));
    setState({visible: true, title: '新增二级分类'})
  }
  // 删除树分类
  function onDelTree(id: number) {
    deleteGoodsTree(id).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        getTree();
      }
    });
  }
  // 默认切换tab栏到列表页并将状态设置为编辑
  function checkedTab(tabsKey: TabsKey = "setting") {
    getTree();
    setTabsKey(tabsKey);
    setCateState((data) => ({ ...data, status: "edit" }));
  }
  // 树过滤递归算法
  function onFilter(
    catName: string,
    list: DataNode[] & Partial<Request.CategoryTree>[],
    data: DataNode[] & Partial<Request.CategoryTree>[]
  ) {
    list.forEach((item) => {
      if (item.children) {
        onFilter(
          catName,
          item.children as DataNode[] & Partial<Request.CategoryTree>[],
          data
        );
      }
      if ((item as Partial<Request.CategoryTree>).catName?.includes(catName)) {
        data.push({ ...item, children: [] });
      }
    });
  }
  // 分类属性分页改变触发
  function attrTableChange(pagination: TablePaginationConfig) {
    setAttrData((data) => {
      return {
        ...data,
        offset: (pagination.current as number) - 1,
      };
    });
    goodsCateAttrList(target.id, (pagination.current as number) - 1);
  }
  // 获取分类属性列表数据
  function goodsCateAttrList(
    id: number,
    offset = attrData.offset,
    limit = attrData.limit
  ) {
    goodsCategoryList(id, offset, limit).then((res) => {
      const { data, code, msg, total } = res.data;
      if (!+code) {
        setAttrData((list) => {
          return {
            ...list,
            data: data as Request.GoodsCategoryAttrList[],
            limit,
            offset,
            total: total as number,
          };
        });
      } else {
        message.error(msg);
      }
    });
  }
  // 关联商品
  function connectGoods() {
    // 麻了麻了，用魔法打败魔法！
    let _id = 0;
    setData(data => {
      const { id } = data;
      _id = id
      return data
    })
    let list: Key[] = [];
    
    // 由于hooks特性 notConnectGoodsList这里获取每次都是刚开始的数据 并不是change方法没有改变；notConnectGoodsList闭包读取每一次都是初始化的数据。故而出此下策直接在change里异步触发请求更改
    setNotConnectList((data) => {
      const { selectList } = data;
      list = selectList;
      return data;
    });
    if (list.length) {
      goodsCategoryConnect(_id, list).then((res) => {
        const { code, msg } = res.data;
        if (+code) {
          message.error(msg);
        } else {
          message.success(msg);
          goodsList(_id, 0);
          (goodsContext.current as any).closeDrawer();
        }
      });
    } else {
      (goodsContext.current as any).closeDrawer();
    }

    // goodsCategoryConnect(target.id, notConnectGoodsList.selectList).then(res => {
    //   const { code, msg } = res.data;
    //   if (+code) {
    //     message.error(msg)
    //   } else {
    //     message.success(msg);
    //     goodsList(target.id, 0);
    //   }
    // })
  }
  // 关联商品列表
  function goodsList(categoryId = target.id, offset = goodsListInfo.offset) {
    getGoodsList({
      categoryId,
      offset,
      limit: goodsListInfo.limit,
      goodsName: goodsListInfo.goodsName,
    }).then((res) => {
      const { code, msg, data, total } = res.data;
      if (+code) {
        message.error(msg);
        setList({
          data: [],
          limit: 10,
          offset: 0,
          total: 0,
          goodsName: goodsListInfo.goodsName,
        });
      } else {
        setList((temp) => {
          return {
            ...temp,
            data: data as Request.GoodsList[],
            total: total as number,
            offset,
          };
        });
      }
    });
  }
  // 移除关联
  function onDelTableData(id: number) {
    deleteConnectGoods(target.id, id).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        message.success(msg);
        goodsList();
      }
    });
  }
  // 关联商品分页触发
  function connectGoodsListPagition(pagination: TablePaginationConfig) {
    setList((data) => {
      return {
        ...data,
        offset: (pagination.current as number) - 1,
      };
    });
    goodsList(target.id, (pagination.current as number) - 1);
  }
  // 获取所有未关联的分类商品列表
  function notCategory(
    goodsName = "",
    offset = notConnectGoodsList.offset,
    limit = notConnectGoodsList.limit
  ) {
    goodsListNotCategory(goodsName, offset, limit).then((res) => {
      const { data, code, msg, total } = res.data;
      if (+code) {
        message.error(msg);
      }
      {
        setNotConnectList((obj) => {
          return {
            ...obj,
            data: data as Request.GoodsList[],
            total: total as number,
            offset,
            limit,
            goodsName,
          };
        });
      }
    });
  }
  // 新增商品分类属性
  function addGoodsAttr(data: {
    attrName: string;
    categoryAttrValueList: Request.CategoryAttrValueResList[];
    groupTip: number
  }) {
    const { attrName, categoryAttrValueList, groupTip } = data;

    addGoodsCategoryAttr({
      categoryId: target.id,
      attrName,
      groupTip,
      attrValueList: categoryAttrValueList.map((item) => item.attrValue),
    }).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        goodsCateAttrList(target.id);
        // 关闭弹窗
        (categoryAttr.current as any).closeModal();
      }
    });
  }
  // 更新商品分类属性
  function updateGoodsAttr(data: {
    attrName: string;
    categoryAttrValueList: Request.CategoryAttrValueResList[];
    categoryAttrId: number;
    groupTip: number
  }) {
    updateGoodsCategoryAttr(data).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        goodsCateAttrList(target.id);
        // 关闭弹窗
        (categoryAttr.current as any).closeModal();
      }
    });
  }
  // 删除商品分类属性
  function deleteGoodsAttr(id: number) {
    deleteGoodsCategoryAttr(id).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        goodsCateAttrList(target.id);
      }
    });
  }
  // 删除商品分类属性值
  async function deleteGoodsAttrVal(id: number) {
    const {data: {data}} = await checkAttrUsed(id);
    return data as boolean
    await deleteGoodsCategoryAttrVal(id).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        goodsCateAttrList(target.id);
      }
    });
  }
  // 请求当前tab数据
  function requestTabKey(key = tabsKey, id = target.id) {
    if (key === "attr") {
      setAttrData((data) => {
        return {
          ...data,
          offset: 0,
          limit: 10,
          total: 0,
        };
      });
      goodsCateAttrList(id);
    } else if (key === "goods") {
      goodsList(id);
    }
  }
  // 添加根节点的树数据
  function addRootTree() {
    setState({visible: true, title: '新增一级分类'});
    setData((data) => {
      return {
        ...data,
        title: "",
        id: 0,
        fTitle: "根节点",
        pid: 0,
        level: 0
      };
    });
    setCateState({ status: "add" });
    // setTabsKey("setting");
  }
  // 关联商品排序
  function onSortTable(sort: number, id: number) {
    updateGoodsSort(sort, id).then(res => {
      const { code, msg } = res.data;
      if (+code) message.error(msg)
      else {
        (goodsContext.current as any).closeInputStatus();
        const { data } = _.cloneDeep(goodsListInfo);
        for(let i = data.length - 1; i >= 0; i--) {
          if (data[i].id === id) {
            data[i].sort = sort;
            break;
          }
        }
        setList(obj => ({...obj, data}));
        message.success(msg)
      }
    })
  }
  // 关闭分类的弹窗
  function onCancel() {
    setState(data => ({...data, visible: false}))
  }
  // 点击新增分类的确定按钮
  function onSubmit() {
    (settingContext.current as any).onSubmit();
  }

  // 初始化获取tab高度
  useEffect(() => {
    getTree();
  }, []);
  useEffect(() => {
    requestTabKey();
  }, [tabsKey]);

  return (
    <div className="category">
      <div className="left-tree">
        <div className="actions">
          <Search
            enterButton
            placeholder="查询分类"
            onSearch={onSearchCate}
            onBlur={(e) => onSearchCate(e.target.value)}
            style={{ marginBottom: "16px" }}
          />
          <Tooltip title="添加一级分类">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={addRootTree}
            />
          </Tooltip>
        </div>
        <TreeData
          tree={tree}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={onSelectTree}
          selectedKeys={selectedKeys}
          onExpand={onExpand}
          showIcon={true}
          showLine={true}
          onAdd={onAddTree}
          onDel={onDelTree}
          pid={target.pid}
          id={target.id}
        />
        {/* <div className="add-category">
          <Button type="primary" size="small">添加一级分类</Button>
        </div> */}
      </div>
      <div className="middle-line" />
      <div className="right-ctx">
        <div className="category-head">
          <Tabs
            activeKey={tabsKey}
            onChange={(key) => setTabsKey(key as TabsKey)}
          >
            {tabs.map((item) => (
              <TabPane
                {...item}
                disabled={
                  (!tree.length || cateState.status === "add") &&
                  item.key !== "setting"
                }
              />
            ))}
          </Tabs>
        </div>
        <div
          className="category-ctx"
          style={{
            height: 'calc(100% - 46px)',
            overflowY: 'auto'
          }}
        >
          {tabs.length ? components[tabsKey] : ''}
        </div>
      </div>
      <Dialog {...dialog} onCancel={onCancel} footer={footer}><CategorySetting {...target} {...cateState} getTree={checkedTab} ref={settingContext} onCloseModal={onCancel} /></Dialog>
    </div>
  );
}
