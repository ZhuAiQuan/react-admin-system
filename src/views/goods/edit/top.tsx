import React, { Dispatch, SetStateAction, ReactNode } from 'react';
import type { Options } from './index'

type Props = {
  options: Options;
  activedKey: string;
  children: ReactNode;
  onChange: (key: string) => void;
}
export default function TopTabs({ options, activedKey, children, onChange }: Props) {
  return (
    <div className='goods-edit-head'>
      <div className='context'>
        {
          options.map(item => <Item key={item.value} {...item} actived={activedKey} onChange={onChange} />)
        }
      </div>
      <div className='right-menu'>{children}</div>
    </div>
  )
}

type Item = {
  label: string;
  value: string;
  actived: string;
  onChange: (key: string) => void
}
function Item({ label, value, actived, onChange }: Item) {
  return (
    <div className={`edit-head-item ${actived === value ? 'edit-head-item-actived' : ''}`} onClick={() => onChange(value)}>
      {label}
    </div>
  )
}