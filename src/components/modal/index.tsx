import { ReactNode } from 'react';
import { Modal } from 'antd'

type Props = {
  visible: boolean;
  title: string;
  footer: ReactNode;
  children: ReactNode;
  onCancel: () => void
}
export default function Dialog(props: Props) {
  const { title, visible, footer, children, onCancel } = props;
  return (
    <Modal title={title} visible={visible} footer={footer} onCancel={onCancel}>{children}</Modal>
  )
}
