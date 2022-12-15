import React from 'react';
import MenuContext from './menu'

type Props = {
  toggle: boolean
}
export default function LeftSide(props: Props) {
  const { toggle } = props
  return (
    <div className='left-side-container' style={{ width: toggle ? '200px' : '60px' }}>
      <div className='logo'>logo in here</div>
      <MenuContext />
    </div>
  )
}
