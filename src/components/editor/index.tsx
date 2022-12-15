import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect, Dispatch, SetStateAction, useRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig } from "@wangeditor/editor";
import { uploadFile, getImgUrl, uploadFileReturnUrl } from "api/uploads";
import { message } from 'antd';
import type { DetailHandle } from 'views/goods/edit'

type Props = {
  text: string;
  getText: Dispatch<SetStateAction<string>>;
};
type InsertFnType = (url: string, alt: string, href: string) => void;

const MyEditor: ForwardRefRenderFunction<DetailHandle, Props> = (props, ref) => {
  const { text, getText } = props;
  const editorRef = useRef<HTMLDivElement | null>(null);
  const status = useRef(true);
  const [editor, setEditor] = useState<IDomEditor | null>(null); // 存储 editor 实例
  const [html, setHtml] = useState(""); // 编辑器内容

  const toolbarConfig = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "请输入内容...",
    MENU_CONF: {},
  };

  editorConfig.MENU_CONF!['uploadImage'] = {
    async customUpload(file: File, insertFn: InsertFnType) {
      if (file.size > 1024*1024*2) {
        message.error('图片太大，无法插入！')
        return
      }
      const _file = new FormData();
      _file.append('file', file)
      // const {data: { data, code, msg }} = await uploadFileReturnUrl(_file);
      // if (+code) {
      //   message.error(msg)
      // } else {
      //   const url = `http://${data as string}`;
      //   insertFn(url, '', url)
      // }
      const {data: { data, code, msg }} = await uploadFile(_file)
      // const { data: {data: base64} } = await getImgUrl(data as string);
      if (+code) {
        message.error(msg)
      } else {
        const url = `${import.meta.env.VITE_BASE_URL}/api/admin/file/download?fileName=${data as string}`
        insertFn(url, '', url)
      }
    }
  }
  editorConfig.MENU_CONF!['uploadVideo'] = {
    customUpload() {
      message.error('暂不支持上传视频功能！')
    }
  }
  // 失焦触发回传数据到父组件
  editorConfig.onBlur = () => {
    editor && getText(editor.getHtml());
  }
  function onChange(context: IDomEditor) {
    setHtml(context.getHtml());
    // getText(context.getHtml());
  }
  function getOffsetHeight() {
    return (editorRef.current as HTMLDivElement).offsetHeight as number
  }
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      // 赋值回去接收
      getText(editor.getHtml());
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  // 模拟 ajax 请求，异步设置 html
  // useEffect(() => {
  //   setHtml(text);
  // }, []);
  useEffect(() => {
    if (text && status.current) {
      setHtml(text);
      status.current = false;
    }
  }, [text])
  useImperativeHandle(ref, () => ({
    getOffsetHeight,
    getContext: () => editor!.getHtml()
  }))

  return (
    <>
      <div
        style={{
          border: "1px solid #ccc",
          zIndex: 100,
          minHeight: "500px",
          margin: "0 20px",
        }}
        ref={editorRef}
      >
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={onChange}
          mode="default"
        />
      </div>
      {/* <div style={{ marginTop: "15px" }}>{html}</div> */}
    </>
  );
}

export default forwardRef(MyEditor);
