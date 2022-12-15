import { ReactNode } from 'react';
import { Drawer, Button } from 'antd'

type Props = {
  visible: boolean;
  placement: "top" | "right" | "left" | "bottom";
  title: string;
  width: number;
  footer: ReactNode;
  children: ReactNode;
  onClose: () => void
}
export default function DrawerModal(props: Props) {
  const {visible, placement, title, width, footer, children, onClose} = props;
  return (
    <Drawer visible={visible} placement={placement} onClose={onClose} title={title} width={width} footer={footer}>{children}</Drawer>
  )
}
