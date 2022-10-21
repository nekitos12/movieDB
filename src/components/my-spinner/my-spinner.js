import React from 'react'
import { Spin } from 'antd'
import './my-spinner.css'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
)
function MySpinner() {
  return (
    <div className="films__spinner">
      <Spin indicator={antIcon} />
    </div>
  )
}

export default MySpinner
