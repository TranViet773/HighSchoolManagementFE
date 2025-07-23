import React, { useState, useEffect } from "react";
import { Card, Avatar, Descriptions, Button, Input, Upload, Select, DatePicker } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined, PhoneOutlined, ManOutlined, KeyOutlined , WomanOutlined, EditOutlined, SaveOutlined, UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import AddressService from "../services/addressService";
import AuthService from "../services/authService";
import dayjs from "dayjs";
import ImportService from "../services/commonService";

const { Option } = Select;

const UserInfomationComponent = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [provinceData, setProvinceData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [wardData, setWardData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [addressDetail, setAddressDetail] = useState(null);
  const [selectedFile , setSelectedFile] = useState(null);


    // Lấy danh sách tỉnh khi component mount
    useEffect(() => {
      const fetchProvinces = async () => {
        try {
          console.log(user)
          const { data } = await AddressService.getAllProvince();
          console.log(data.data)
          setProvinceData(data.data);
        } catch {
          toast.error("Lỗi khi lấy danh sách tỉnh!");
        }
      };
      fetchProvinces();
    }, []);
  
    // Lấy danh sách huyện khi tỉnh thay đổi
    useEffect(() => {
      if (!selectedProvince) {
        setDistrictData([]);
        setSelectedDistrict("");
        return;
      }
      const fetchDistricts = async () => {
        try {
          const { data } = await AddressService.getAllDistrictByProvince(selectedProvince);
          setDistrictData(data.data);
        } catch {
          toast.error("Lỗi khi lấy danh sách huyện!");
        }
      };
      fetchDistricts();
    }, [selectedProvince]);
  
    // Lấy danh sách xã khi huyện thay đổi
    useEffect(() => {
      if (!selectedDistrict) {
        setWardData([]);
        setSelectedWard("");
        return;
      }
      const fetchWards = async () => {
        try {
          const { data } = await AddressService.getAllWardByDistrict(selectedDistrict);
          setWardData(data.data);
        } catch {
          toast.error("Lỗi khi lấy danh sách xã!", {autoClose: 1000});
        }
      };
      fetchWards();
    }, [selectedDistrict]);



  const handleEdit = () => setIsEditing(true);
  const handleSave = async () => {
    let avatar;
    console.log("File " + selectedFile);
    if(selectedFile!=null){
      try{
        const {data} = await ImportService.UploadImage(selectedFile);
        console.log(data);
        avatar = data.secureUri;
      }catch{
        toast.error("Lỗi khi upload ảnh. Vui lòng thử lại!", 1000);
      }
    }

    if(formData.address.detail!=null){
      if(user.address.ward == ""){
        try{
          const {data} = await AddressService.createAddressForUser(user.id, selectedWard, formData.address.detail);
          console.log(data);
          avatar = data.secureUri;
        }catch{
          toast.error("Lỗi khi cập nhật địa chỉ. Vui lòng thử lại!", 500);
        }
      }else{
        try{
          const {data} = await AddressService.updateAddressForUser(user.id, selectedWard, formData.address.detail);
          console.log(data);
          avatar = data.secureUri;
        }catch{
          toast.error("Lỗi khi cập nhật địa chỉ. Vui lòng thử lại!", 500);
        }
      }
    }
    try {
      const genderBoolean = formData.gender === "Nam" ? true : formData.gender === "Nữ" ? false : null;
      // Gửi dữ liệu cập nhật lên server
      await AuthService.UpdateUser({
        id: user.id,
        FullName: formData.fullName,
        Email: formData.email,
        Gender: genderBoolean,
        PhoneNumber: formData.phone,
        Avatar: avatar,
        DoB: formData.birthDay,
      });
  
      toast.success("Cập nhật thông tin thành công!", { autoClose: 1500 });

      setIsEditing(false);
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin!", { autoClose: 1500 });
      console.error("Update error:", error);
    }
  };
  


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (value) => {
    setFormData({ ...formData, gender: value });
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 pt-8 w-full">
      <Card className="w-full max-w-4xl shadow-lg rounded-2xl">
        <div className="flex flex-col items-center gap-4 p-4">
          <Avatar 
            size={120} 
            src={formData.avatar} 
            icon={!formData.avatar && <UserOutlined />} 
          />
          
          {isEditing && (
            <Upload showUploadList={true} beforeUpload={(file) => setSelectedFile(file)}>
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          )}

          <Descriptions title="Thông Tin Cá Nhân" bordered column={2} className="w-full">
            <Descriptions.Item label={<strong><UserOutlined /> Họ Tên</strong>} span={1}>
                {formData.fullName}
            </Descriptions.Item>
            
            <Descriptions.Item label={<strong><IdcardOutlined /> Mã Số</strong>} span={1}>
              {formData.code}
            </Descriptions.Item>

            <Descriptions.Item label={<strong><PhoneOutlined /> Điện Thoại</strong>} span={1}>
              {isEditing ? (
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              ) : (
                formData.phone
              )}
            </Descriptions.Item>
            <Descriptions.Item label={<strong><IdcardOutlined /> Giới Tính</strong>} span={1}>
              {isEditing ? (
                <Select value={formData.gender} className="w-full" onChange={handleGenderChange}>
                  <Option value={true}>Nam</Option>
                  <Option value={false}>Nữ</Option>
                </Select>
              ) : (
                formData.gender === "Nam" ? <ManOutlined className="text-blue-500" /> : <WomanOutlined className="text-pink-500" />
              )}
            </Descriptions.Item>

            <Descriptions.Item label={<strong><MailOutlined /> Email</strong>} span={1}>
              {formData.email}
            </Descriptions.Item>
            <Descriptions.Item label={<strong><MailOutlined /> Ngày sinh</strong>} span={1}>
              {isEditing ? (
                <DatePicker
                  value={formData.birthDay ? dayjs(formData.birthDay) : null} 
                  onChange={(date, dateString) => setFormData({ ...formData, birthDay: dateString })}
                  format="YYYY-MM-DD"
                />
              ) : (
                formData.birthDate || "Chưa cập nhật"
              )}
            </Descriptions.Item>

            <Descriptions.Item label={<strong><MailOutlined /> Địa chỉ</strong>} span={2}>
              {isEditing ? (
                <>
                  <Select
                    name="province"
                    style={{ marginBottom: "2px", width: "100%" }}
                    value={formData.address.province || undefined} 
                    placeholder="Chọn tỉnh"
                    onChange={(value, option) => {
                      setSelectedProvince(value);
                      setFormData({
                        ...formData,
                        address: { ...formData.address, province: option.children, district: "", ward: "" }
                      });
                    }}
                  >
                    {provinceData.map((p) => (
                      <Option key={p.province_Id} value={p.province_Id}>{p.province_Name}</Option>
                    ))}
                  </Select>

                  <Select
                    name="district"
                    style={{ marginBottom: "2px", width: "100%" }}
                    value={formData.address.district || undefined}
                    placeholder="Chọn quận/huyện"
                    onChange={(value, option) => {
                      setSelectedDistrict(value);
                      setFormData({
                        ...formData,
                        address: { ...formData.address, district: option.children, ward: "" }
                      });
                    }}
                    disabled={!selectedProvince}
                  >
                    {districtData.map((p) => (
                      <Option key={p.districts_Id} value={p.districts_Id}>{p.districts_Name}</Option>
                    ))}
                  </Select>

                  <Select
                    name="ward"
                    style={{ marginBottom: "2px", width: "100%" }}
                    value={formData.address.ward || undefined}
                    placeholder="Chọn xã/phường"
                    onChange={(value, option) => {
                      setSelectedWard(value);
                      setFormData({
                        ...formData,
                        address: { ...formData.address, ward: option.children }
                      });
                    }}
                    disabled={!selectedDistrict}
                  >
                    {wardData.map((p) => (
                      <Option key={p.ward_Id} value={p.ward_Id}>{p.ward_Name}</Option>
                    ))}
                  </Select>

                  <Input 
                    name="detail" 
                    value={formData.address.detail || undefined}
                    placeholder="Địa chỉ chi tiết" 
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, detail: e.target.value }
                    })} 
                    style={{ marginBottom: "2px" }} 
                  />

                </>
              ) : (
                formData.address.detail + ", " + formData.address.ward + ", " + formData.address.district + ", " + formData.address.province  
              )}
            </Descriptions.Item>
          </Descriptions>

          <div className="flex justify-between w-full">
            <Button
              type="primary"
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={isEditing ? handleSave : handleEdit}
            >
              {isEditing ? "Lưu" : "Chỉnh Sửa"}
            </Button>

            <Button type="default" icon={<KeyOutlined />} >
              Đổi Mật Khẩu
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
};

export default UserInfomationComponent;
