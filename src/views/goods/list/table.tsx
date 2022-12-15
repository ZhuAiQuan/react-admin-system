import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from "react";
import { Table, Popconfirm, Space, InputNumber, Button, Tooltip } from "antd";
import type { Columns, TableData, Locale, Options } from "./index";
import { EditOutlined } from "@ant-design/icons";
import LoadingImg from "_c/load/loadImg";
import ContextMenu from '_c/contextMenu'

const { Column } = Table;

type Props = {
  columns: Columns;
  dataSource: Request.GoodsList[];
  rowSelection: RowSelection;
  locale: Locale;
  loading: boolean;
  onDelTableData: (ids: number[]) => void;
  onEditTableData: (id: number) => void;
  onSortTable: (sort: number, id: number) => void;
};
interface RowSelection {
  type: "checkbox" | "radio";
  onChange: (
    selectedRowKeys: React.Key[],
    selectedRows: Request.GoodsList[]
  ) => void;
  // getCheckboxProps: (record: TableData) => void
}
function GoodsTable(props: Props & Options, ref: any) {
  const {
    locale,
    dataSource,
    rowSelection,
    loading,
    ctxH,
    searchH,
    addH,
    pageH,
    onDelTableData,
    onEditTableData,
    onSortTable,
  } = props;
  const input = useRef(null);
  const [sortInfo, changeSort] = useState({
    visible: false,
    num: 0,
    id: 0,
    index: 0
  })
  function onSortChange(data: Request.GoodsList, index: number) {
    changeSort({visible: true, num: data.sort, id: data.id, index})
  }
  function closeEditMode() {
    changeSort(data => ({...data, visible: false}))
  }
  useImperativeHandle(ref, () => ({
    closeEditMode
  }))
  useEffect(() => {
    if (sortInfo.visible) {
      (input.current as any).focus()
    }
    
  }, [sortInfo.visible])

  return (
    <Table
      dataSource={dataSource}
      rowSelection={rowSelection}
      locale={locale}
      pagination={false}
      loading={loading}
      rowKey={(record) => record.id}
      // scroll={{
      //   y: ctxH - searchH - addH - pageH - 55,
      // }}
    >
      <Column
        title="商品信息"
        dataIndex="goodsInfo"
        key="goodsInfo"
        render={(_, record: Request.GoodsList) => (
          <div className="gooods-info">
            <div className="pic">
              <LoadingImg
                goodsPicture={record.goodsSpecPictureList.length ? record.goodsSpecPictureList[0].goodsPicture : ''}
              />
            </div>
            <div className="info">
              <div className="name">
                <Tooltip title={record.goodsName} placement="topLeft">{record.goodsName}</Tooltip>
                
              </div>
              <div className="code">编码：<Tooltip title={record.spuCode} placement="topLeft">{record.spuCode}</Tooltip></div>
            </div>
          </div>
        )}
        width={300}
      />
      {/* <Column
        title="售价"
        dataIndex="salesPrice"
        key="salesPrice"
        render={(salesPrice: number) => (
          <div className="saler-price">{salesPrice}</div>
        )}
        align="center"
      /> */}
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
        sorter={(a, b) => (a as Request.GoodsList).createTime - (b as Request.GoodsList).createTime}
      />
      <Column
        title="排序值"
        dataIndex="sort"
        key="sort"
        render={(sort: number, record: Request.GoodsList, i: number) => (
          <div>
            {
              sortInfo.visible && i === sortInfo.index
               ? <InputNumber ref={input} value={sortInfo.num} onChange={(val) => changeSort(data => ({...data, num: val}))} onBlur={() => onSortTable(sortInfo.num, sortInfo.id)} />
               : <Space>
                  {sort}
                  <EditOutlined
                    style={{ color: "#2CB2C2", cursor: "pointer" }}
                    onClick={() => onSortChange(record, i)}
                  />
                </Space>
            }
            
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
            <ContextMenu url={`/goods/edit/${record.id}`}>
              <Button type="link" onClick={() => onEditTableData(record.id)}>
                编辑
              </Button>
            </ContextMenu>
            <Popconfirm
              title={`将删除本条数据，是否继续？`}
              onConfirm={() => onDelTableData([record.id])}
              okText="继续"
              cancelText="取消"
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        )}
        width={180}
        align="center"
      />
    </Table>
  );
}

export default forwardRef(GoodsTable)