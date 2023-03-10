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
      title: "??????",
      dataIndex: "attrName",
      render: (_, row) => (
        <Space>
          {row.attrName}
          {row.groupTip ? <Tag>??????</Tag> : ""}
        </Space>
      ),
    },
    {
      title: "?????????",
      dataIndex: "categoryAttrValueResList",
      render: (
        categoryAttrValueResList: Request.GoodsCategoryAttrList["categoryAttrValueResList"]
      ) => (
        <>{categoryAttrValueResList.map((item) => item.attrValue).join("???")}</>
      ),
    },
    {
      title: "??????",
      dataIndex: "actions",
      render: (_: unknown, record: Request.GoodsCategoryAttrList) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            ??????
          </Button>
          <Popconfirm
            onConfirm={() => deleteGoodsAttr(record.categoryAttrId)}
            title="????????????????????????????????????????????????????????????"
            okText="??????"
            cancelText="??????"
            placement="topRight"
          >
            <Button type="link">??????</Button>
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
        <Button onClick={closeModal}>??????</Button>
        <Button type="primary" onClick={onSubmit}>
          ??????
        </Button>
      </Space>
    </div>
  );
  // ????????????
  function onEdit(row: Request.GoodsCategoryAttrList) {
    updateModalState((data) => {
      return {
        ...data,
        title: `?????? ${row.attrName} ??????`,
        visible: true,
        target: row,
        categoryAttrId: row.categoryAttrId,
      };
    });
  }
  // ??????????????????
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
    if (modal.title.includes("???")) {
      //
      addGoodsAttr(form.form);
    } else {
      // ??????
      updateGoodsAttr({
        ...form.form,
        categoryAttrId: modal.categoryAttrId as number,
      });
    }
  }
  // ????????????
  function onAdd() {
    updateModalState((data) => {
      return {
        ...data,
        title: "????????????",
        visible: true,
      };
    });
  }
  // ????????????
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
            [`${key}_help`]: "?????????????????????",
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
            [`${key}_help`]: "??????????????????",
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
  // ???????????????
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
      message.info("?????????????????????!");
    }
    // ??????????????????
    updateVisible(false);
  }
  async function onClose(
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    id: number | null,
    i: number
  ) {
    const { categoryAttrValueList } = _.cloneDeep(form.form);
    if (categoryAttrValueList.length <= 1) {
      message.warning("??????????????????????????????");
      e.preventDefault(); // ????????????
      return;
    } else {
      // ?????????id?????? ????????????
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
          e.preventDefault(); // ????????????
          message.warning(
            `?????????${categoryAttrValueList[i].attrValue}??????????????????????????????`
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
  // ????????????
  function closeModal() {
    updateModalState((data) => {
      return {
        ...data,
        visible: false,
      };
    });
  }
  // ????????????
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
  // ???????????????????????????
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
      // ????????????
      // ????????????
      updateModalState((data) => {
        return {
          title: data.title,
          visible: data.visible,
        };
      });
      // ???????????????????????????
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
          ??????
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
            label="????????????"
            required={true}
            validateStatus={form.rules.attrName}
            help={form.rules.attrName_help}
          >
            <Input
              value={form.form.attrName}
              onChange={(e) => onChange("attrName", e.target.value)}
              placeholder="??????????????????"
            />
          </Item>
          <Item
            label="?????????"
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
                    <PlusOutlined /> ?????????
                  </Tag>
                )}
              </div>
            </DndProvider>
          </Item>
          <Item label="??????????????????">
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
              <Tooltip title="?????????????????????????????????????????????????????????????????????????????????????????????">
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
