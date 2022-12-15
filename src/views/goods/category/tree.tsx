import { useState, Key } from "react";
import { Tree, Button, Space, Tooltip, Popconfirm } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

type Props = {
  tree: DataNode[];
  showIcon: boolean;
  showLine: boolean;
  expandedKeys: Key[];
  autoExpandParent: boolean;
  selectedKeys: Key[];
  pid: number;
  id: number;
  onSelect: TreeProps["onSelect"];
  onExpand: (list: Key[]) => void;
  onAdd: (data: DataNode & Partial<Request.CategoryTree>) => void;
  onDel: (id: number) => void;
};
export default function TreeData(props: Props) {
  const {
    tree,
    showIcon,
    showLine,
    expandedKeys,
    autoExpandParent,
    selectedKeys,
    pid,
    id,
    onSelect,
    onExpand,
    onAdd,
    onDel,
  } = props;

  return (
    <Tree
      treeData={tree}
      onSelect={onSelect}
      showIcon={showIcon}
      showLine={{showLeafIcon: false}}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      selectedKeys={selectedKeys}
      onExpand={onExpand}
      titleRender={(
        nodeData: DataNode & { catName?: string; level?: number; id?: number }
      ) => (
        <div className={`${pid === nodeData.id && 'open-title'} ${id === nodeData.id && 'selected-title'}`}>
          <Space className="title">
            <span>{nodeData.catName}</span>
            {nodeData.level && nodeData.level === 1 ? (
              <>
                <Tooltip title="添加二级分类">
                  <PlusCircleOutlined
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd(
                        nodeData as DataNode & Partial<Request.CategoryTree>
                      );
                    }}
                  />
                </Tooltip>
              </>
            ) : (
              ""
            )}
            {(!nodeData.children || !nodeData.children.length) && (
              <Popconfirm title="确定删除此分类？" okText="确定" cancelText="取消" onConfirm={() => onDel(nodeData.id as number)}>
                <Tooltip title="删除">
                  <MinusCircleOutlined />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        </div>
      )}
      fieldNames={{
        title: "catName",
        key: "id",
      }}
    ></Tree>
  );
}
