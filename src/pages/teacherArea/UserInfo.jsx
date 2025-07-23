import React, { useEffect, useState } from 'react'
import { Layout } from 'antd';
import SidebarTeacher from '../../components/SideBarComponent/SideBarTeacher';
import UserInfomationComponent from '../../components/UserInfomationComponent';
import AuthService from '../../services/authService';
import { getInforJwt } from '../../tools/utils';
import AddressService from '../../services/addressService';
const UserInfoTeacher = () => {
  const [userData, setUserData] = useState(null);
  const id = getInforJwt().Id;
  useEffect(() =>{
    fecthUserInfo();
    
  }, [])
  const fecthUserInfo = async () => {
    try{
      const {data} = await AuthService.getById(id);
      console.log(data);
      setUserData({
        id: id,
        avatar: data.avatar,
        fullName: data.fullName,
        code: data.code,
        classCode: data.classCode,
        gender: true ? "Nam" : "Nữ",
        birthDate: data.doB,
        email: data.email,
        phone: data.phoneNumber,
        ethnicity: "Kinh",
        parent: {
          name: "Nguyễn Văn B",
          phone: "0912345678",
          job: "Kinh doanh",
        },
        address: {
          province: data.address?.province_Name || "",
          district: data.address?.district_Name || "",
          ward: data.address?.ward_Name || "",
          detail: data.address?.address_Detail || "",
        },
      });

      console.log(userData);
      }catch(e){

    }
  }
  return (
    <Layout style={{minHeight: "100vh"}}>
        <SidebarTeacher />
        <Layout style={{padding: "20px"}}>
        {userData ? <UserInfomationComponent user={userData} /> : <p>Đang tải...</p>}
        </Layout>
    </Layout>
  )
}

export default UserInfoTeacher;
