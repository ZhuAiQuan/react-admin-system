import { Segmented } from 'antd';
import type { Options } from '../Main';

type Props = {
  options: Options;
  value: number;
  onChange: (val: number) => void
}
export default function SegmentedEl(props: Props) {
  const { options, value, onChange } = props;

  return (
    <Segmented options={options} value={value} onChange={(seg) => onChange(seg as number)}></Segmented>
  )
}
