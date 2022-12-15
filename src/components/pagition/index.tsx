import { Pagination } from 'antd';
import './index.less';

type Props = {
  total: number;
  pageSize: number;
  current: number;
  showSizeChanger: boolean;
  pageSizeOptions: number[];
  showTotal: (total: number) => string;
  onChange: (page: number, pageSize: number) => void
}
// 设置默认值
const defaultProps: Props = {
  total: 0,
  pageSize: 10,
  current: 1,
  showSizeChanger: true,
  pageSizeOptions: [10, 20, 50, 100],
  showTotal: (total) => `共${total}商品`,
  onChange: () => {}
}
function Page(props = defaultProps) {

  return (
    <div className='custom-pagination'>
      <Pagination {...props} />
    </div>
  )
}

export default Page
