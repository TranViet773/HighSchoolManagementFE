import React, { useEffect, useState } from 'react';
import { Card, Form, Input } from "antd";

const ParentComponent = ({ data }) => {
    const [studentData, setStudentData] = useState({});
    
    useEffect(() => {
        if(data!=null){
            setStudentData(data);
        }
    }, [data]);


    return (
        <div>
            <Card 
                className="mt-2 mb-2 shadow-lg" 
                title="Thông tin phụ huynh" 
                variant="borderless" 
                headStyle={{ backgroundColor: "#B5E7FF", color: "#333" }}
                style={{marginBottom: "20px"}}
            >
                <div className="grid grid-cols-3 gap-4">
                    <Form.Item label="Họ tên cha">
                        <Input 
                            placeholder="Nhập họ tên" 
                            value={studentData?.dad_name || ""} // Cung cấp giá trị mặc định là rỗng nếu không có
                        />
                    </Form.Item>
                    <Form.Item label="Nghề nghiệp">
                        <Input 
                            placeholder="Nhập nghề nghiệp" 
                            value={studentData?.dad_career || ""} 
                        />
                    </Form.Item>
                    <Form.Item label="Số điện thoại">
                        <Input 
                            placeholder="Nhập SĐT" 
                            value={studentData?.parent_phone || ""} 
                        />
                    </Form.Item>
                    <Form.Item label="Họ tên mẹ">
                        <Input 
                            placeholder="Nhập họ tên" 
                            value={studentData?.mom_name || ""} 
                        />
                    </Form.Item>
                    <Form.Item label="Nghề nghiệp">
                        <Input 
                            placeholder="Nhập nghề nghiệp" 
                            value={studentData?.mom_career || ""} 
                        />
                    </Form.Item>
                </div>
            </Card>
        </div>
    );
}

export default ParentComponent;
