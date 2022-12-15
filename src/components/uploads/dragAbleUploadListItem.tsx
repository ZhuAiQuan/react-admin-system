import { PlusOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import type { UploadFile, UploadProps, RcFile } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { getToken } from "utils/cookies";
import * as _ from "lodash";
import { uploadFile } from "api/uploads";

const type = "DragableUploadList";

interface DragableUploadListItemProps {
  originNode: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  file: UploadFile;
  fileList: UploadFile[];
  moveRow: (dragIndex: any, hoverIndex: any) => void;
}

const DragableUploadListItem = ({
  originNode,
  moveRow,
  file,
  fileList,
}: DragableUploadListItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const index = fileList.indexOf(file);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? " drop-over-downward" : " drop-over-upward",
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${
        isOver ? dropClassName : ""
      }`}
      style={{ cursor: "move" }}
    >
      {file.status === "error" ? "" : originNode}
    </div>
  );
};

interface Props {
  resource: Request.SpecPictureValueReqList[];
  accept: string[];
  maxCount: number;
  size: string;
  onDragSort: (temp: Request.SpecPictureValueReqList[]) => void;
  onUploads: (src: string) => void;
  onRemove: (i: number) => void;
}

const App = ({
  resource,
  onDragSort,
  maxCount,
  accept,
  size,
  onUploads,
  onRemove,
}: Props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const header = {
    Authorization: `Bearer ${getToken()}`,
  };
  const baseUrl =
    import.meta.env.MODE === "development"
      ? "/api"
      : import.meta.env.VITE_BASE_URL;
  const action = `${baseUrl}/api/admin/file/fileUpload`;

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      /**
       * dragIndex: 拖动元素初始的索引；
       * hoverIndex: 拖动完成后元素的索引位置；
       */
      const temp = _.cloneDeep(resource);
      const targetTemp = temp[dragIndex];
      temp.splice(dragIndex, 1);
      temp.splice(hoverIndex, 0, targetTemp);
      onDragSort(temp);
    },
    [fileList]
  );
  // 自动上传图片
  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    // 离离原上谱啊 这个antd upload受控组件 https://github.com/ant-design/ant-design/issues/2423
    // 这他妈完全受控，我现在这种模式根本无法控制 淦 手动上传吧
    // info.fileList.slice();
    // console.log(info.fileList)
    // if (info.file.status) {
    //   console.log(info)
    // }
  };
  // 上传前
  const beforeUpload = async (file: RcFile) => {
    if (fileList.length > maxCount - 1) {
      message.warning(`最多可以上传${maxCount}张图片!`);
      return false;
    }
    const sizeType = await checkLength(file);
    const isJpgOrPng = accept.includes(file.type);
    // const acp = accept.map((item) => item.split("/")[1]).join("、");
    if (!isJpgOrPng) {
      message.error(`图片不符合要求!`);
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('图片内存不能大于2M!');
    // }
    // return isJpgOrPng && (sizeType as boolean);

    if (isJpgOrPng && (sizeType as boolean)) {
      // 手动上传
      uploadPicture(file);
    }
    return false;
  };
  // 检查图片分辨率大小
  function checkLength(file: RcFile) {
    if (size) {
      const img = new Image();
      img.src = window.webkitURL.createObjectURL(file);
      const f = size.split("*").map(Number);
      return new Promise((resolve, reject) => {
        img.onload = function () {
          const { width, height } = img;
          const ends = width / height;
          if (
            f[0] &&
            f[1] &&
            (f[0] !== width || f[1] !== height) &&
            ends !== f.reduce((i, j) => i / j) &&
            f[0]
          ) {
            message.error({
              content: `图片不符合要求！`,
              duration: 3,
            });
            reject(false);
          } else resolve(true);
        };
      });
    } else return true;
  }
  // 手动上传图片 注意 后台接口不允许多张 所以我禁掉了多张图片上传 多张直接return
  function uploadPicture(file: RcFile) {
    const formData = new FormData();
    if (file instanceof Array) {
      // file.forEach(f => {
      //   formData.append('file', f)
      // })
      return;
    } else {
      formData.append("file", file);
    }
    uploadFile(formData).then((res) => {
      const { code, msg, data } = res.data;
      if (+code) {
        message.error(msg);
      } else {
        onUploads(data as string);
      }
    });
  }
  // 移出图片
  function onRemoveFile(file: UploadFile) {
    const i = resource.findIndex((item) => item.goodsPicture === file.name);
    if (i > -1) onRemove(i);
    else return false;
  }
  // 自定义预览
  function onPreview(file: UploadFile) {
    const img = new Image();
    img.src = file.url as string;
    const newWin = window.open("", "_blank") as Window;
    newWin.document.write(img.outerHTML);
    newWin.document.title = `预览图片 ${file.name}`;
    newWin.document.close();
  }

  useEffect(() => {
    setFileList(
      resource.map((item, i) => {
        return {
          uid: item.id ? `${item.id}` : `-${i}`,
          name: item.goodsPicture,
          status: "done",
          url: `${
            import.meta.env.VITE_BASE_URL
          }/api/admin/file/download?fileName=${item.goodsPicture}`,
        };
      })
    );
  }, [resource]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Upload
        action={action}
        listType="picture-card"
        maxCount={maxCount}
        headers={header}
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={onChange}
        onRemove={onRemoveFile}
        onPreview={onPreview}
        itemRender={(originNode, file, currFileList) => (
          <DragableUploadListItem
            originNode={originNode}
            file={file}
            fileList={currFileList}
            moveRow={moveRow}
          />
        )}
      >
        <Button icon={<PlusOutlined />} type="text">
          上传
        </Button>
      </Upload>
    </DndProvider>
  );
};

export default App;
