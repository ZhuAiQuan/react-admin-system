import { useEffect, useState, useRef } from "react";
import { message, Upload } from "antd";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import type { UploadChangeParam } from "antd/es/upload";
import {
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { getToken } from "utils/cookies";
import { getImgUrl } from "api/uploads";
import * as _ from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.less";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

type Props = {
  showUploadList: boolean;
  accept: string[];
  maxCount: number;
  size: string;
  defaultList: string | Request.SpecPictureValueReqList[];
  onUploads: (fileName: string) => void;
  onRemove?: (i: number) => void;
};
type FileList = {
  fileName: string;
  url: string;
};
export default function Uploads(props: Props) {
  const { showUploadList, accept, maxCount, onUploads, defaultList } = props;
  const status = useRef(true);
  const baseUrl =
    import.meta.env.MODE === "development"
      ? "/api"
      : import.meta.env.VITE_BASE_URL;
  const action = `${baseUrl}/api/admin/file/fileUpload`;
  const header = {
    Authorization: `Bearer ${getToken()}`,
  };
  // const [imageUrl, onChange] = useState('');
  // const [imgaeList, setImgList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<FileList[]>([]);
  const [loading, setLoading] = useState(false);
  // 上传图片改变
  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      // Get this url from response in real world.
      const {
        file: { response },
      } = info;
      const { code, data, msg } = response as {
        code: string;
        data: string;
        msg: string;
      };

      if (!+code) {
        imgUrl(data);
        // getBase64(info.file.originFileObj as RcFile, (url) => {
        //   const temp = _.cloneDeep(fileList);
        //   temp.push({
        //     fileName: data,
        //     url,
        //   });
        //   setFileList(temp);
        // });
        onUploads(data);
        setLoading(false);
      } else {
        message.error(msg);
      }
    }
    if (info.file.status === "error") {
      message.error("上传图片失败，请重试！");
      setLoading(false);
    }
  };
  // 上传前
  const beforeUpload = async (file: RcFile) => {
    const sizeType = await checkLength(file);

    const isJpgOrPng = accept.includes(file.type);
    const acp = accept.map((item) => item.split("/")[1]).join("、");
    if (!isJpgOrPng) {
      message.error(`图片不符合要求!`);
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('图片内存不能大于2M!');
    // }
    return isJpgOrPng && (sizeType as boolean);
  };
  // 点击移除按钮
  const onRemove = (i: number) => {
    const temp = _.cloneDeep(fileList);
    temp.splice(i, 1);
    setFileList(temp);
    if (maxCount > 1) {
      props.onRemove && props.onRemove(i);
    } else onUploads("");
  };
  // 检查图片分辨率大小
  function checkLength(file: RcFile) {
    if (props.size) {
      const img = new Image();
      img.src = window.webkitURL.createObjectURL(file);
      const f = props.size.split("*").map(Number);
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
  function imgUrl(name: string, type = false) {
    if (!name) return null;
    const url = `${
      import.meta.env.VITE_BASE_URL
    }/api/admin/file/download?fileName=${name}`;
    if (type) return { fileName: name, url };
    else {
      const data = _.cloneDeep(fileList);
      data.push({ fileName: name, url });
      setFileList(data);
    }
  }
  // 回显数据
  useEffect(() => {
    if (status.current) {
      if (typeof defaultList === "string") {
        imgUrl(defaultList);
      } else {
        const temp = defaultList.map((item) => imgUrl(item.goodsPicture, true));
        if (temp) setFileList(temp as FileList[]);
      }
      status.current = false;
    }
  }, [defaultList]);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );
  const previewPicture = (
    <DndProvider backend={HTML5Backend}>
      <div className="preview-context">
        {fileList.map((item, i) => (
          <div className="preview-context-item" key={`${i}${item.fileName}`}>
            <img src={item.url} alt={item.fileName} />
            <div
              className="delete-icons"
              title="移除图片"
              onClick={() => onRemove(i)}
            >
              <DeleteOutlined style={{ fontSize: "18px" }} />
            </div>
          </div>
        ))}
      </div>
    </DndProvider>
  );

  return (
    <div className="uploads-context">
      {fileList.length ? previewPicture : ""}
      {fileList.length < maxCount ? (
        <Upload
          className="avatar-uploader"
          listType="picture-card"
          showUploadList={showUploadList}
          action={action}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          maxCount={maxCount}
          headers={header}
        >
          {uploadButton}
        </Upload>
      ) : (
        ""
      )}
    </div>
  );
}
