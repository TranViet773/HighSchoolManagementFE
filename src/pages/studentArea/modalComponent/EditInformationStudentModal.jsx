import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import AddressService from '../../../services/addressService';
import AuthService from '../../../services/authService';
import ImportService from '../../../services/commonService';
import { toast } from 'react-toastify';
const EditInformationStudentModal = ({ student }) => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(student.avatar || '');
  const [provinceData, setProvinceData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Lấy danh sách tỉnh khi component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await AddressService.getAllProvince();
        setProvinceData(data.data);
      } catch {
        message.error('Lỗi khi lấy danh sách tỉnh!');
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách huyện khi tỉnh thay đổi
  useEffect(() => {
    if (!selectedProvince) {
      setDistrictData([]);
      setSelectedDistrict(null);
      return;
    }
    const fetchDistricts = async () => {
      try {
        const { data } = await AddressService.getAllDistrictByProvince(selectedProvince);
        setDistrictData(data.data);
      } catch {
        message.error('Lỗi khi lấy danh sách huyện!');
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Lấy danh sách xã khi huyện thay đổi
  useEffect(() => {
    if (!selectedDistrict) {
      setWardData([]);
      setSelectedWard(null);
      return;
    }
    const fetchWards = async () => {
      try {
        const { data } = await AddressService.getAllWardByDistrict(selectedDistrict);
        setWardData(data.data);
      } catch {
        message.error('Lỗi khi lấy danh sách xã!');
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  // Xử lý submit form
  const handleSubmit = async (values) => {
    const {phoneNumber, province, district, ward, addressDetail} = values;
    console.log({selectedFile});
    let avt;
    if(selectedFile!=null){
        try{
            console.log(avatar);
            const {data} = await ImportService.UploadImage(selectedFile);
            console.log(data.secureUri);
            avt = data.secureUri;
        }catch(e){
            toast.error("Lỗi khi cập nhật ảnh đại diện!");
        }
    }
    try{
        await AuthService.UpdateUser({
            id: student.id,
            FullName: undefined,
            Email: undefined,
            Gender: undefined,
            PhoneNumber: phoneNumber,
            Avatar: avt,
            DoB: undefined,
            });
        toast.success("cập nhật thông tin thành công!");
    }catch(e){
        toast.error("Có lỗi khi cập nhật thông tin!");
        console.log(e);
    }

    
    try{
        console.log({student, selectedWard, addressDetail});
        if(student.address?.province_Id !=null)
        {
          const {data} = await AddressService.updateAddressForUser(student.id, selectedWard, addressDetail);
          console.log(data);
        }else{
          const {data} = await AddressService.createAddressForUser(student.id, selectedWard, addressDetail);
        }
    }catch(e){
        
    }

    
  };

  // Xử lý thay đổi ảnh đại diện
  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      setAvatar(info.file.response.url);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <Form
      form={form}
      initialValues={{
        phoneNumber: student.phoneNumber,
        address: student.address,
        province: student.address?.province_Name,
        district: student.address?.district_Name,
        ward: student.address?.ward_Name,
        addressDetail: student.address?.address_Detail
      }}
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item
        label="Số điện thoại"
        name="phoneNumber"
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tỉnh"
        name="province"
        rules={[{ required: true, message: 'Vui lòng chọn tỉnh!' }]}
      >
        <Select placeholder="Chọn tỉnh" onChange={(value) => setSelectedProvince(value)} value={selectedProvince}>
          {provinceData.map((item) => (
            <Select.Option key={item.province_Id} value={item.province_Id}>
              {item.province_Name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Huyện"
        name="district"
        rules={[{ required: true, message: 'Vui lòng chọn huyện!' }]}
      >
        <Select
          placeholder="Chọn huyện"
          onChange={(value) => setSelectedDistrict(value)} 
          value={selectedDistrict}
          disabled={!selectedProvince}
        >
          {districtData.map((item) => (
            <Select.Option key={item.districts_Id} value={item.districts_Id}>
              {item.districts_Name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Xã"
        name="ward"
        rules={[{ required: true, message: 'Vui lòng chọn xã!' }]}
      >
        <Select
          placeholder="Chọn xã"
          onChange={(value) => setSelectedWard(value)} 
          value={selectedWard}
          disabled={!selectedDistrict}
        >
          {wardData.map((item) => (
            <Select.Option key={item.ward_Id} value={item.ward_Id}>
              {item.ward_Name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Địa chỉ chi tiết"
        name="addressDetail"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Ảnh đại diện" name="avatar">
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={(file) => setSelectedFile(file)}
          //onChange={handleAvatarChange}
          maxCount={1}
        >
          {avatar ? (
            <img src={avatar} alt="avatar" style={{ width: '100%' }} />
          ) : (
            <div>
              <UploadOutlined />
              <div>Chọn ảnh</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditInformationStudentModal;
