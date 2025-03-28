import React from 'react'
import {Card, Form, Input} from "antd";
const ParentComponent = () => {
  return (
    <div>
        <Card className="mt-2 mb-2 shadow-lg" title="Thông tin phụ huynh" variant="borderless" headStyle={{ backgroundColor: "#B5E7FF", color: "#333" }}>
            <div className="grid grid-cols-3 gap-4">
            <Form.Item label="Họ tên phụ huynh">
                <Input placeholder="Nhập họ tên" />
            </Form.Item>
            <Form.Item label="Số điện thoại">
                <Input placeholder="Nhập SĐT" />
            </Form.Item>
            <Form.Item label="Nghề nghiệp">
                <Input placeholder="Nhập nghề nghiệp" />
            </Form.Item>
            </div>
        </Card>
    </div>
  )
}

export default ParentComponent
