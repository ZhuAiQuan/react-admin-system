import { useState, useEffect, useRef } from "react";
import Header from "./header";
import ContextMenu from "_c/contextMenu";
import { Button, Space, Popconfirm, message, ConfigProvider } from "antd";
import Page from "_c/pagition";
import GoodsTable from "./table";
import { useNavigate } from "react-router-dom";
import { getGoodsList, deleteGoods, updateGoodsSort, getOptionCatName } from "api/goods";
import type { ColumnsType } from "antd/es/table";
import * as _ from "lodash";
import zhCN from 'antd/es/locale/zh_CN';
import { setFlatToTree } from 'utils/tools'
import "./index.less";

const columns: ColumnsType<Request.GoodsList> = [
  {
    title: "商品信息",
    key: "goodsDetail",
    dataIndex: "goodsDetail",
  },
  {
    title: "售价",
    key: "salesPrice",
    dataIndex: "salesPrice",
  },
  {
    title: "创建时间",
    key: "createTime",
    dataIndex: "createTime",
  },
  {
    title: "排序值",
    key: "sort",
    dataIndex: "sort",
  },
  {
    title: "操作",
    key: "actions",
    dataIndex: "actions",
  },
];
const locale = {
  filterTitle: "筛选",
  filterConfirm: "确定",
  filterReset: "重置",
  filterEmptyText: "无筛选项",
  filterCheckall: "全选",
  filterSearchPlaceholder: "在筛选项中搜索",
  selectAll: "全选当页",
  selectInvert: "反选当页",
  selectNone: "清空所有",
  selectionAll: "全选所有",
  sortTitle: "排序",
  expand: "展开行",
  collapse: "关闭行",
  triggerDesc: "点击降序",
  triggerAsc: "点击升序",
  cancelSort: "取消排序",
};
export type Locale = typeof locale;
export type Columns = typeof columns;
export type TableData = {
  goodsInfo: string;
  sales: string;
  createTime: string;
  index: number;
  id: number;
};
export type Options = {
  addH: number;
  searchH: number;
  pageH: number;
  ctxH: number;
};
export type Form = {
  spuCode: string;
  goodsName: string;
  categoryId: undefined | number;
  sort: number | undefined;
  createTimeStart: string;
  createTimeEnd: string;
};
export type SelectOption = {
  catName: string;
  id: number
}

export default function index() {
  const location = useNavigate();
  // 分页相关
  const [page, updatePage] = useState({
    current: 0,
    total: 0,
    pageSize: 20,
    showSizeChanger: true,
    loading: false,
    pageSizeOptions: [20, 50],
  });
  // 表格数据
  const [data, setData] = useState<Request.GoodsList[]>([]);
  // 表格选中数据
  const [checkTableId, getCheckId] = useState<number[]>([]);
  const [options, setOption] = useState<Options>({
    addH: 84,
    searchH: 72,
    pageH: 64,
    ctxH: 0,
  });
  const [searchParams, getParams] = useState<Form>({
    spuCode: "",
    goodsName: "",
    categoryId: undefined,
    sort: undefined,
    createTimeStart: "",
    createTimeEnd: "",
  });
  const [selectOption, setSelectOption] = useState<(Request.RequestCatNameTreeData & {
    children?: Request.RequestCatNameTreeData[] | undefined;
})[]>([])

  const ctx = useRef<HTMLDivElement | null>(null);
  const tableContext = useRef(null);

  // 分页
  const onChange = (current: number, pageSize: number) => {
    requestData(current - 1, pageSize);
  };
  // 分页总数文案
  const showTotal = (total: number) => `共${total}件商品`;
  // 添加商品
  const onAdd = () => {
    // add goods
    location("/goods/edit/add");
  };
  // 编辑商品信息
  const onEdit = (id: number) => {
    // router push
    location(`/goods/edit/${id}`);
  };
  // 请求数据接口
  const requestData = (offset = page.current, limit = page.pageSize) => {
    // request api
    updatePage((data) => {
      return {
        ...data,
        loading: true,
        current: offset,
        pageSize: limit,
      };
    });
    const data = {
      offset,
      limit,
      ...searchParams,
    };
    getGoodsList(data).then((res) => {
      const {
        data: { data, code, msg, total },
      } = res;
      if (+code) {
        
        ![1001, 1002, 1003].includes(+code) && message.error(msg);
        setData([]);
        updatePage((data) => {
          return {
            ...data,
            total: 0,
            offset: 1,
            limit: 10,
            loading: false,
          };
        });
      } else {
        setData(data as Request.GoodsList[]);
        updatePage((data) => {
          return {
            ...data,
            total: total as number,
            loading: false,
          };
        });
      }
    });
  };
  // 表格多选
  const tableChange = (_: unknown, data: Request.GoodsList[]) => {
    // console.log(keys, data);
    getCheckId(() => data.map((item) => item.id));
  };
  // 表格当前选中
  // const tableNowCheck = (row: TableData) => {
  //   console.log(row)
  // }
  // 表格删除
  const onDelTableData = (ids: number[]) => {
    deleteGoods(ids).then((res) => {
      const { msg, code } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        requestData();
        getCheckId([]);
        message.success(msg);
      }
    });
  };
  // 表格排序值修改
  const onSortTable = (sort: number, id: number) => {
    if (data.filter(item => item.id === id && item.sort === sort).length) {
      (tableContext.current as any).closeEditMode();
      return
    }
    updateGoodsSort(sort, id).then((res) => {
      const { code, msg } = res.data;
      if (+code) {
        message.error(msg);
        (tableContext.current as any).closeEditMode();
      } else {
        const temp = _.cloneDeep(data);
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id === id) {
            temp[i].sort = sort;
            break;
          }
        }
        setData(temp);
        (tableContext.current as any).closeEditMode();
        message.success(msg)
      }
    });
  };

  function getHeader(h: number) {
    setOption((data) => {
      return {
        ...data,
        searchH: h,
      };
    });
  }
  // 获取商品分类数据
  function getOption() {
    getOptionCatName().then(res => {
      const { code, data, msg } = res.data;
      if (+code) {
        message.error(msg)
      } else {
        const temp = setFlatToTree(data as Request.RequestCatNameTreeData[])
        setSelectOption(temp);
      }
    })
  }

  useEffect(() => {
    setOption((data) => {
      return {
        ...data,
        ctxH: (ctx.current as HTMLDivElement).offsetHeight,
      };
    });
    requestData();
    // document.oncontextmenu = (e) => {
    //   e.preventDefault();
    // }
  }, []);
  return (
    <div className="list-ctx" ref={ctx}>
      <ConfigProvider locale={zhCN}>
      <Header
        search={requestData}
        getHeader={getHeader}
        {...searchParams}
        options={selectOption}
        onChange={getParams}
        getOption={getOption}
      />
      <div className="add">
        <Space>
          {checkTableId.length ? (
            <Popconfirm
              title="确定删除这些选中的数据吗？一旦删除将无法恢复！"
              onConfirm={() => onDelTableData(checkTableId)}
              okText="继续"
              cancelText="取消"
            >
              <Button>批量删除</Button>
            </Popconfirm>
          ) : (
            <Button disabled={true}>批量删除</Button>
            // <div></div>
          )}
        </Space>
        <ContextMenu url="/goods/edit/add">
          <Button type="primary" onClick={onAdd}>
            新建商品
          </Button>
        </ContextMenu>
      </div>
      <GoodsTable
        columns={columns}
        dataSource={data}
        rowSelection={{ type: "checkbox", onChange: tableChange }}
        locale={locale}
        loading={page.loading}
        {...options}
        onDelTableData={onDelTableData}
        onEditTableData={onEdit}
        onSortTable={onSortTable}
        ref={tableContext}
      />
      <Page
        {...page}
        current={page.current + 1}
        onChange={onChange}
        showTotal={showTotal}
      />
      </ConfigProvider>
    </div>
  );
}
