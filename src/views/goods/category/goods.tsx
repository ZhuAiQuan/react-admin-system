import {
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
  useImperativeHandle,
  forwardRef
} from "react";
import { Button, Input, Table, Tooltip, Space, InputNumber } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import type { GoodsListInfo, NotConnectGoodsInfo } from "./index";
import DrawerModal from "_c/drawer";
import LoadingImg from "_c/load/loadImg";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Column } = Table;
type Props = {
  title: string;
  id: number;
  notConnectGoodsList: GoodsListInfo & NotConnectGoodsInfo;
  getNotCategory: (goodsName: string, offset: number, limit: number) => void;
  onChange: Dispatch<SetStateAction<GoodsListInfo>>;
  onDelTableData: (id: number) => void;
  onSortTable: (sort: number, id: number) => void;
  getData: () => void;
  tableChange: (page: TablePaginationConfig) => void;
  onChangeDrawerTable: Dispatch<SetStateAction<GoodsListInfo & NotConnectGoodsInfo>>;
  onConnectGoods: () => void;
};
interface DrawerType {
  visible: boolean;
  title: string;
  placement: "top" | "right" | "left" | "bottom";
  width: number;
  footer: ReactNode;
}
function GoodsList(props: Props & GoodsListInfo, ref: any) {
  const {
    id,
    total,
    offset,
    limit,
    goodsName,
    notConnectGoodsList,
    data,
    onChange: change,
    onSortTable,
    onDelTableData,
    getNotCategory,
    getData,
    tableChange,
    onChangeDrawerTable,
    onConnectGoods
  } = props;
  const location = useNavigate();
  const [drawer, setDrawer] = useState<DrawerType>({
    visible: false,
    title: "添加商品",
    placement: "right",
    width: 500,
    footer: (
      <>
        <Space>
          <Button onClick={closeDrawer}>取消</Button>
          <Button type="primary" onClick={onConnectGoods}>
            确定
          </Button>
        </Space>
      </>
    ),
  });
  const [sortInfo, changeSort] = useState({
    visible: false,
    num: 0,
    id: 0,
    index: 0,
  });

  function onDelete(row: Request.GoodsList) {
    console.log(row);
  }
  function onDetail(record: Request.GoodsList) {
    // push 商品详情页面
  }
  // 添加商品
  function onAdd() {
    setDrawer((data) => {
      return {
        ...data,
        visible: true,
      };
    });
  }
  // 关闭右侧弹窗
  function closeDrawer() {
    setDrawer((data) => {
      return {
        ...data,
        visible: false,
      };
    });
  }
  // 选中表格触发
  function onChange(
    selectList: React.Key[],
    selectedRows: Request.GoodsList[]
  ) {
    onChangeDrawerTable(data => {
      // console.log(data, notConnectGoodsList);
      return {
        ...data,
        selectList
      }
    })
  }
  // 关闭排序状态
  function closeInputStatus() {
    changeSort(data => ({...data, visible: false}))
  }

  useEffect(() => {
    if (drawer.visible) {
      getNotCategory("", 0, 10);
    } else {
      setDrawer(data => {
        return {
          ...data,
          goodsName: '',
          limit: 10,
          offset: 0,
          total: 0
        }
      })
      onChangeDrawerTable(data => {
        return {
          ...data,
          selectList: [],
        }
      })
    }
  }, [drawer.visible]);
  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    closeDrawer,
    closeInputStatus
  }))
  return (
    <div className="goods-list">
      <div className="featur">
        {/* <Button type="primary" onClick={onAdd}>
          关联商品
        </Button> */}
        <Search
          enterButton
          onSearch={() => getData()}
          value={goodsName}
          onChange={(e) => change(data => ({...data, goodsName: e.target.value}))}
          style={{ maxWidth: "220px" }}
          placeholder="查询商品名称"
        />
      </div>
      <Table dataSource={data} rowKey={(record) => record.id} pagination={{total, current: offset + 1, pageSize: limit}} onChange={tableChange}>
        <Column
          title="商品信息"
          dataIndex="goodsInfo"
          key="goodsInfo"
          render={(_, record: Request.GoodsList) => (
            <div className="gooods-info">
              <div className="pic">
                <LoadingImg
                  goodsPicture={record.goodsSpecPictureList[0].goodsPicture}
                />
              </div>
              <div className="info">
                <div className="name"><Tooltip title={record.goodsName} placement="topLeft">{record.goodsName}</Tooltip></div>
                <div className="code">编码：{record.spuCode}</div>
              </div>
            </div>
          )}
          width={300}
        />
        <Column
          title="创建时间"
          dataIndex="createTime"
          key="createTime"
          render={(createTime: number) => (
            <div className="create-time">
              {createTime
                ? `${new Date(createTime)
                    .toLocaleDateString()
                    .split("/")
                    .join("-")} ${
                    new Date(createTime).toTimeString().split(" ")[0]
                  }`
                : ""}
            </div>
          )}
          align="center"
        />
        <Column
          title="排序值"
          dataIndex="sort"
          key="sort"
          render={(sort: number, record: Request.GoodsList, i: number) => (
            <div>
              {sortInfo.visible && i === sortInfo.index ? (
                <InputNumber
                  value={sortInfo.num}
                  onChange={(val) =>
                    changeSort((data) => ({ ...data, num: val }))
                  }
                  onBlur={() => onSortTable(sortInfo.num, sortInfo.id)}
                />
              ) : (
                <Space>
                  {sort}
                  <EditOutlined
                    style={{ color: "#2CB2C2", cursor: "pointer" }}
                    onClick={() =>
                      changeSort({
                        visible: true,
                        id: record.id,
                        index: i,
                        num: record.sort,
                      })
                    }
                  />
                </Space>
              )}
            </div>
          )}
          sorter={(a, b) => a.sort - b.sort}
          align="center"
        />
        <Column
          title="操作"
          dataIndex="actions"
          key="actions"
          render={(_, record: Request.GoodsList) => (
            <>
              <Button type="link" onClick={() => location(`/goods/edit/${record.id}`)}>
                详情
              </Button>
              {/* <Popconfirm
                title={`将移除本条关联商品数据，是否继续？`}
                onConfirm={() => onDelTableData(record.id)}
                okText="继续"
                cancelText="取消"
              >
                <Button type="link">移除</Button>
              </Popconfirm> */}
            </>
          )}
          width={120}
          align="center"
        />
      </Table>
      <DrawerModal {...drawer} onClose={closeDrawer}>
        <div className="drawer-ctx">
          <Search
            enterButton
            value={notConnectGoodsList.goodsName}
            onChange={(e) => onChangeDrawerTable(data => ({...data, goodsName: e.target.value}))}
            placeholder="查询商品名称"
            style={{ marginBottom: "16px" }}
            onSearch={() => getNotCategory(notConnectGoodsList.goodsName, 0, 10)}
          />
          <Table
            rowSelection={{ type: "checkbox", onChange, selectedRowKeys: notConnectGoodsList.selectList }}
            dataSource={notConnectGoodsList.data}
            rowKey={(record) => record.id}
            size="small"
            pagination={{
              total: notConnectGoodsList.total,
              current: notConnectGoodsList.offset + 1,
              pageSize: notConnectGoodsList.limit
            }}
            onChange={({ current, pageSize }) => getNotCategory(notConnectGoodsList.goodsName, (current as number) - 1, pageSize as number)}
          >
            <Column
              title="商品信息"
              dataIndex="goodsSpecPictureList"
              key="goodsSpecPictureList"
              render={(_, record: Request.GoodsList) => (
                <div className="gooods-info">
                  <div className="pic">
                    <LoadingImg
                      goodsPicture={record.goodsSpecPictureList[0].goodsPicture}
                    />
                  </div>
                  <div className="info">
                    <div className="name">{record.goodsName}</div>
                    <div className="code">编码：{record.spuCode}</div>
                  </div>
                </div>
              )}
            />
          </Table>
        </div>
      </DrawerModal>
    </div>
  );
}

export default forwardRef(GoodsList)
