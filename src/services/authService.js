import axiosInstance, { service } from "../tools/axios.tool";
import { getInforJwt } from "../tools/utils";
const AuthService = {
    async Login({email, password}) {
        const response = await axiosInstance.post("/Auth/login", {email: email, password: password});
        const {data, status, error} = await service(response);
        if (error) {
            throw error; 
          }
          return { data, status }; 
    },
    async LogOut(refreshToken) {
        const response = await axiosInstance.post("/Auth/revoke-refresh-token", {refreshToken: refreshToken});
        const { data, status, error } = await service(response);
        if (error) {
            throw error;
        }
        return { data, status };    
    },
    async getById(id) {
        const response = await axiosInstance.get(`/Auth/user/${id}`);
        const { data, status, error } = await service(response);
        if (error) {
            throw error;
        }
        return { data, status };
    },
    async deleteById(id) {
        const response = await axiosInstance.delete(`/Auth/delete-user/${id}`);
        const { data, status, error } = await service(response);
        if (error) {
            throw error;
        }
        return { data, status };
    },

    async changePassword({OldPassword, NewPassword}){
        const id = getInforJwt().Id;
        console.log(id, NewPassword, OldPassword);
        const response = await axiosInstance.post(`/Auth/change-password/${id}`,{
            OldPassword, NewPassword
        });
        const { data, status, error } = await service(response);
        if (error) {
            throw error;
        }
        return { data, status };
    }
}
export default AuthService;