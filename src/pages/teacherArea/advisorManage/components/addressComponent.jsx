import React, { useState, useEffect } from "react";
import { Card, Form, Select, Input, Button, message } from "antd";
import axios from "axios";
import AddressService from "../../../../services/addressService";
import { toast } from "react-toastify";

const { Option } = Select;

const AddressComponent = ({ studentAddress, idUser }) => {
  const [form] = Form.useForm();
  const [selectedProvince, setSelectedProvince] = useState(studentAddress?.province.province_Id || "");
  const [selectedDistrict, setSelectedDistrict] = useState(studentAddress?.district.districts_Id || "");
  const [selectedWard, setSelectedWard] = useState(studentAddress?.ward || "");
  const [addressDetail, setAddressDetail] = useState(studentAddress?.detail || "");
  const [provinceData, setProvinceData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [wardData, setWardData] = useState([]);

  // Lấy danh sách tỉnh khi component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await AddressService.getAllProvince();
        setProvinceData(data.data);
      } catch {
        toast.error("Lỗi khi lấy danh sách tỉnh!");
      }
    };
    fetchProvinces();
    console.log(studentAddress)
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
        console.log("district: " +  JSON.stringify(data.data, null, 2));
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

  // Cập nhật form khi nhận giá trị ban đầu
  useEffect(() => {
    form.setFieldsValue({
      province: studentAddress?.province,
      district: studentAddress?.district,
      ward: studentAddress?.ward,
      detail: studentAddress?.detail,
    });
  }, [studentAddress, form]);


  const handleSaveAddress = async (isNew) =>{
    try{
      if(isNew)
      {
        const {data} = await AddressService.createAddressForUser(idUser, selectedWard, addressDetail);
        toast.success("Cập nhật thành công!", {autoClose: 1000});
      }
      else{
        console.log(idUser, selectedWard, addressDetail)
        const {data} = await AddressService.updateAddressForUser(idUser, selectedWard, addressDetail);
        toast.success("Cập nhật thành công!", {autoClose: 1000});
      }
    }catch{
      toast.error("Có lỗi xảy ra khi cập nhật!", {autoClose: 1000});
    }

  }

  // Xử lý chọn tỉnh -> Cập nhật huyện
  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    console.log(selectedProvince);
    setSelectedDistrict("");
    setSelectedWard("");
  };

  // Xử lý chọn huyện -> Cập nhật xã
  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard("");
  };

  return (
    <Card className="mt-2 mb-2 shadow-lg" title="Địa chỉ & Thông tin phụ huynh" variant="borderless" headStyle={{ backgroundColor: "#B5E7FF", color: "#333" }}>
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-3 gap-4">
          {/* Tỉnh */}
          <Form.Item label="Tỉnh" name="province">
            <Select placeholder="Chọn tỉnh" onChange={handleProvinceChange} value={selectedProvince}>
              {provinceData.map((p) => (
                <Option key={p.province_Id} value={p.province_Id}>
                  {p.province_Name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Huyện */}
          <Form.Item label="Huyện" name="district">
            <Select placeholder="Chọn huyện" onChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedProvince}>
              {districtData.map((d) => (
                <Option key={d.districts_Id} value={d.districts_Id}>
                  {d.districts_Name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Xã */}
          <Form.Item label="Xã (*)" name="ward">
            <Select placeholder="Chọn xã" onChange={setSelectedWard} value={selectedWard} disabled={!selectedDistrict}>
              {wardData.map((w) => (
                <Option key={w.ward_Id} value={w.ward_Id}>
                  {w.ward_Name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* Địa chỉ chi tiết */}
        <Form.Item label="Địa chỉ chi tiết" name="detail">
          <Input placeholder="Nhập địa chỉ cụ thể" value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
        </Form.Item>

        {/* Nút Lưu */}
        <Button type="primary" className="mt-2" onClick={() => handleSaveAddress(studentAddress.province === '' ? 1 : 0)}>
          { studentAddress.province=='' ? "Thêm địa chỉ mới" : "Lưu thông tin"}
        </Button>
      </Form>
    </Card>
  );
};

export default AddressComponent;
