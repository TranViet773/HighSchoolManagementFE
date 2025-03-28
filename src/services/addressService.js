import { data } from "react-router-dom";
import axiosInstance from "../tools/axios.tool";
const AddressService = {
    async getAllProvince(){
        try{
            const response = await axiosInstance.get("/Address/get-all-province");
            return { data: response.data, status: response.status };
        }catch (error) {
            console.error("Lỗi khi lấy danh sách", error);
            throw error;
        }
    },
    async getAllDistrictByProvince(provinceId){
        try{
            const response = await axiosInstance.get(`/Address/get-districts-by-province/${provinceId}`);
            return { data: response.data, status: response.status };
        }catch (error) {
            console.error("Lỗi khi lấy danh sách", error);
            throw error;
        }
    },
    async getAllWardByDistrict(districtId){
        try{
            const response = await axiosInstance.get(`/Address/get-wards-by-district/${districtId}`);
            return { data: response.data, status: response.code };
        }catch (error) {
            console.error("Lỗi khi lấy danh sách", error);
            throw error;
        }
    },

    async updateAddressForUser(idUser, wardId, detail){
        try{
            const response = await axiosInstance.put(`/Address/update-address-user/`,{
                Address_Detail: detail,
                Ward_Id: wardId,
                idUser
            });
            return {data: response.data, status: response.code}
        }catch(error){
            console.error("Lỗi khi cập nhật!", error);
            throw error;
        }
    },

    async createAddressForUser(idUser, wardId, detail){
        try{
            const response = await axiosInstance.post(`/Address/create`,{
                Address_Detail: detail,
                Ward_Id: wardId,
                idUser: idUser
            });
            return {data: response.data, status: response.code}
        }catch(error){
            console.error("Lỗi khi tạo mới!", error);
            throw error;
        }
    },
}
export default AddressService;