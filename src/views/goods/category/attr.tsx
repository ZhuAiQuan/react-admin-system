import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  Button,
  Table,
  Space,
  Form,
  Input,
  Tag,
  InputRef,
  message,
  Popconfirm,
  Switch,
  Tooltip,
} from "antd";
import Dialog from "_c/modal";
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { AttrData } from "./index";
import * as _ from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragableUploadListItem from "_c/drag";

const { Item } = Form;

type ValidateStatus = Parameters<typeof Form.Item>[0]["validateStatus"];
type Modal = {
  title: string;
  visible: boolean;
  target?: Request.GoodsCategoryAttrList;
  categoryAttrId?: number;
};
type Rules = {
  attrName: ValidateStatus;
  attrName_help: string;
  categoryAttrValueList: ValidateStatus;
  categoryAttrValueList_help: string;
};
type Form = {
  rules: Rules;
  form: FormData;
};
type FormData = {
  attrName: string;
  categoryAttrValueList: Request.CategoryAttrValueResList[];
  groupTip: 0 | 1;
};
type Props = {
  addGoodsAttr: (data: FormData) => void;
  updateGoodsAttr: (data: FormData & { categoryAttrId: number }) => void;
  deleteGoodsAttr: (id: number) => void;
  deleteGoodsAttrVal: (id: number) => Promise<boolean>;
  onChange: Dispatch<SetStateAction<AttrData>>;
  tableChange: (page: TablePaginationConfig) => void;
};
function CategoryAttr(props: Props & AttrData, fromRef: any) {
  const {
    addGoodsAttr,
    data,
    limit,
    offset,
    total,
    updateGoodsAttr,
    deleteGoodsAttr,
    deleteGoodsAttrVal,
    tableChange,
  } = props;
  const inputRef = useRef<InputRef | null>(null);
  // const [data, setData] = useState<Request.GoodsCategoryAttrList[]>([]);
  const [modal, updateModalState] = useState<Modal>({
    title: "",
    visible: false,
  });
  const [form, setFormItem] = useState<Form>({
    rules: {
      attrName: "",
      attrName_help: "",
      categoryAttrValueList: "",
      categoryAttrValueList_help: "",
    },
    form: {
      attrName: "",
      categoryAttrValueList: [],
      groupTip: 0,
    },
  });
  const [inputVisisble, updateVisible] = useState(false);
  const [attrValue, setAttrVal] = useState("");
  const columns: ColumnsType<Request.GoodsCategoryAttrList> = [
    {
      title: "属性",
      dataIndex: "attrName",
      render: (_, row) => (
        <Space>
          {row.attrName}
          {row.groupTip ? <Tag>分组</Tag> : ""}
        </Space>
      ),
    },
    {
      title: "属性值",
      dataIndex: "categoryAttrValueResList",
      render: (
        categoryAttrValueResList: Request.GoodsCategoryAttrList["categoryAttrValueResList"]
      ) => (
        <>{categoryAttrValueResList.map((item) => item.attrValue).join("、")}</>
      ),
    },
    {
      title: "操作",
      dataIndex: "actions",
      render: (_: unknown, record: Request.GoodsCategoryAttrList) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            onConfirm={() => deleteGoodsAttr(record.categoryAttrId)}
            title="确定删除分类属性吗？一旦删除将无法恢复！"
            okText="确认"
            cancelText="取消"
            placement="topRight"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </Space>
      ),
      align: "center",
      width: "120px",
    },
  ];
  const footer = (
    <div style={{ textAlign: "center" }}>
      <Space>
        <Button onClick={closeModal}>取消</Button>
        <Button type="primary" onClick={onSubmit}>
          确认
        </Button>
      </Space>
    </div>
  );
  // 编辑属性
  function onEdit(row: Request.GoodsCategoryAttrList) {
    updateModalState((data) => {
      return {
        ...data,
        title: `编辑 ${row.attrName} 属性`,
        visible: true,
        target: row,
        categoryAttrId: row.categoryAttrId,
      };
    });
  }
  // 弹窗点击提交
  function onSubmit() {
    //
    const status: boolean[] = [];
    // for (const key in form.form) {
    //   if (key !== 'checked') status.push(onChange(key, form.form[key as keyof typeof form.form]));
    // }
    status.push(onChange("attrName", form.form["attrName"]));
    status.push(
      onChange("categoryAttrValueList", form.form["categoryAttrValueList"])
    );

    if (status.some((item) => !item)) {
      return false;
    }
    if (modal.title.includes("新")) {
      //
      addGoodsAttr(form.form);
    } else {
      // 编辑
      updateGoodsAttr({
        ...form.form,
        categoryAttrId: modal.categoryAttrId as number,
      });
    }
  }
  // 新增属性
  function onAdd() {
    updateModalState((data) => {
      return {
        ...data,
        title: "新建属性",
        visible: true,
      };
    });
  }
  // 手动校验
  function onChange(
    key: string,
    value: string | Request.CategoryAttrValueResList[]
  ) {
    setFormItem((data) => {
      return {
        ...data,
        form: {
          ...data.form,
          [key]: value,
        },
      };
    });
    let status = true;
    if (typeof value === "string" && !value) {
      status = false;
      setFormItem((data) => {
        return {
          ...data,
          rules: {
            ...data.rules,
            [key]: "error",
            [`${key}_help`]: "请输入属性名称",
          },
        };
      });
    } else if (
      Array.isArray(value) &&
      (!value.length ||
        (value as Request.CategoryAttrValueResList[]).some(
          (item) => !item.attrValue
        ))
    ) {
      status = false;
      setFormItem((data) => {
        return {
          ...data,
          rules: {
            ...data.rules,
            [key]: "error",
            [`${key}_help`]: "请添加属性值",
          },
        };
      });
    } else {
      setFormItem((data) => {
        return {
          ...data,
          rules: {
            ...data.rules,
            [key]: "success",
            [`${key}_help`]: "",
          },
        };
      });
    }
    return status;
  }
  // 添加属性值
  function handleInputConfirm() {
    if (attrValue.trim()) {
      //
      const { categoryAttrValueList } = _.cloneDeep(form.form);
      categoryAttrValueList.push({ attrValue });
      setFormItem((data) => {
        return {
          ...data,
          form: {
            ...data.form,
            categoryAttrValueList,
          },
        };
      });
      setAttrVal("");
    } else {
      message.info("什么也没有输入!");
    }
    // 关闭输入状态
    updateVisible(false);
  }
  async function onClose(
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: number | null,
    i: number
  ) {
    const { categoryAttrValueList } = _.cloneDeep(form.form);
    if (categoryAttrValueList.length <= 1) {
      message.warning("最少需要一个属性值！");
      e.preventDefault(); // 阻止删除
      return;
    } else {
      // 如果有id的话 请求删除
      if (id) {
        const type = await deleteGoodsAttrVal(id);
        if (!type) {
          categoryAttrValueList.splice(i, 1);
          setFormItem((data) => {
            return {
              ...data,
              form: {
                ...data.form,
                categoryAttrValueList,
              },
            };
          });
        } else {
          e.preventDefault(); // 阻止删除
          message.warning(
            `属性值${categoryAttrValueList[i].attrValue}被使用中，无法删除！`
          );
        }
      } else {
        categoryAttrValueList.splice(i, 1);
        setFormItem((data) => {
          return {
            ...data,
            form: {
              ...data.form,
              categoryAttrValueList,
            },
          };
        });
      }
    }
  }
  // 关闭弹窗
  function closeModal() {
    updateModalState((data) => {
      return {
        ...data,
        visible: false,
      };
    });
  }
  // 拖动排序
  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const temp = _.cloneDeep(form.form.categoryAttrValueList);
      const targetTemp = temp[dragIndex];
      temp.splice(dragIndex, 1);
      temp.splice(hoverIndex, 0, targetTemp);
      setFormItem(data => {
        return {
          ...data,
          form: {
            ...data.form,
            categoryAttrValueList: temp
          }
        }
      })
    },
    [form.form.categoryAttrValueList]
  );
  // 暴露给父组件的方法
  useImperativeHandle(fromRef, () => ({
    closeModal,
  }));

  useEffect(() => {
    if (modal.visible) {
      if (typeof modal.target !== "undefined") {
        setFormItem(() => {
          return {
            form: {
              attrName: (modal.target as Request.GoodsCategoryAttrList)
                .attrName,
              categoryAttrValueList: _.cloneDeep(
                (modal.target as Request.GoodsCategoryAttrList)
                  .categoryAttrValueResList
              ),
              groupTip: (modal.target as Request.GoodsCategoryAttrList)
                .groupTip,
            },
            rules: {
              attrName: "",
              attrName_help: "",
              categoryAttrValueList: "",
              categoryAttrValueList_help: "",
            },
          };
        });
      }
    } else {
      // 关闭弹窗
      // 清空表单
      updateModalState((data) => {
        return {
          title: data.title,
          visible: data.visible,
        };
      });
      // 关闭添加属性值状态
      updateVisible(false);
      setAttrVal("");
      setFormItem((data) => {
        return {
          ...data,
          form: {
            attrName: "",
            categoryAttrValueList: [],
            groupTip: 0,
          },
        };
      });
    }
  }, [modal.visible]);
  useEffect(() => {
    if (inputVisisble && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisisble]);

  return (
    <div className="category-attr" ref={fromRef}>
      <div className="add">
        <Button type="primary" onClick={onAdd}>
          新建
        </Button>
      </div>
      <Table
        dataSource={data}
        rowKey={(record) => record.categoryAttrId}
        columns={columns}
        pagination={{
          total,
          current: offset + 1,
          pageSize: limit,
        }}
        onChange={tableChange}
      />
      <Dialog {...modal} footer={footer} onCancel={closeModal}>
        <Form>
          <Item
            label="属性名称"
            required={true}
            validateStatus={form.rules.attrName}
            help={form.rules.attrName_help}
          >
            <Input
              value={form.form.attrName}
              onChange={(e) => onChange("attrName", e.target.value)}
              placeholder="输入属性名称"
            />
          </Item>
          <Item
            label="属性值"
            required={true}
            validateStatus={form.rules.categoryAttrValueList}
            help={form.rules.categoryAttrValueList_help}
            className="custom-attr-val"
          >
            <DndProvider backend={HTML5Backend}>
              <div
                style={{
                  paddingTop: form.form.categoryAttrValueList.length
                    ? "8px"
                    : "0",
                }}
              >
                {form.form.categoryAttrValueList.map((item, i) => (
                  <DragableUploadListItem
                    originNode={
                      <Tag
                        className="edit-tag"
                        
                        closable
                        onClose={(e) => onClose(e, item.attrValueId || null, i)}
                        visible={!!item.attrValueId || !!item.attrValue}
                      >
                        {item.attrValue}
                      </Tag>
                    }
                    file={item}
                    fileList={form.form.categoryAttrValueList}
                    moveRow={moveRow}
                    key={`${JSON.stringify(item)}-${i}}`}
                  />
                ))}
                {inputVisisble ? (
                  <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    className="tag-input"
                    value={attrValue}
                    onChange={(e) => setAttrVal(e.target.value)}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                  />
                ) : (
                  <Tag
                    className="site-tag-plus"
                    onClick={() => updateVisible(true)}
                  >
                    <PlusOutlined /> 属性值
                  </Tag>
                )}
              </div>
            </DndProvider>
          </Item>
          <Item label="按此属性分组">
            <Space>
              <Switch
                // checkedChildren={<CheckOutlined />}
                // unCheckedChildren={<CloseOutlined />}
                checked={!!form.form.groupTip}
                onChange={(groupTip) =>
                  setFormItem((data) => ({
                    ...data,
                    form: { ...data.form, groupTip: groupTip ? 1 : 0 },
                  }))
                }
              />
              <Tooltip title="开启后，在官网上会按照该属性分组展示。每个品类可设置一个分组。">
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          </Item>
        </Form>
      </Dialog>
    </div>
  );
}
export default forwardRef(CategoryAttr);
