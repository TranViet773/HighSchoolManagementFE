import { data } from "react-router-dom";
import axiosInstance from "../tools/axios.tool";
import qs from "qs";
const ReevaluationService = {
    async CreateReevaluation(formData){
        try {
            const response = await axiosInstance.post(`/Reevaluation`, 
                formData
            );
            return {data: response.data, status: response.status}
        } catch (error) {
            return { error: error.response?.data || "Lỗi không xác định", status: error.response?.status || 500 };
        }
    },

    async GetReevaluationByYearAndStatus(status, year, query){
        try{
            console.log({status, year, query})
            const response = await axiosInstance.get(`/Reevaluation/status/${status}/year?year=${year}&query=${query}`);
            console.log(response.data)
            return {data: response.data, status: response.message}
        }catch(e){
            return { error: "Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau!" };
        }
    },

    async GetReevaluationByTeacher(status, teacherId, year){
        try{
            console.log({status, teacherId})
            const response = await axiosInstance.get(`/Reevaluation/teacher/${teacherId}?eStatus=${status}&year=${year}`);
            console.log(response.data)
            return {data: response.data, status: response.message}
        }catch(e){
            console.log(e)
            return { error: "Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau!" };
        }
    },

    async GetReevaluationById(id){
        try{
            const response = await axiosInstance.get(`/Reevaluation/${id}`);
            //console.log(response.data)
            return {data: response.data, status: response.message}
        }catch(e){
            return { error: "Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau!" };
        }
    },

    async UpdateStatus(e, id){
        try{
            const response = await axiosInstance.put(`/Reevaluation/status/${id}`, { eStatus: e });
            //console.log(response.data)
            return {data: response.data, status: response.message}
        }catch(e){
            console.log(e)
            return { error: "Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau!" };
        }
    },

    async UpdateReevaluationStatusAndUpdateScore(id, year, semester, score){
        try{
            const response = await axiosInstance.put(`/Reevaluation/${id}/score?year=${year}&semester=${semester}`, score,{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return {data: response.data, status: response.message}
        }catch(e){
            console.log(e)
            return { error: "Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau!" };
        }
    },

    async UpdateReevaluationAsync(id, score, status){
        try{
            const response = await axiosInstance.put(`/Reevaluation/${id}`, {Reevaluation_AfterScore: score, Reevaluation_Status: status},{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return {data: response.data, status: response.message}
        }catch(e){
            console.log(e)
            return { error: "Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau!" };
        }
    },

    async BlockReevaluation(id, eStatus){
        try{
            const response = await axiosInstance.put(`/Reevaluation/${id}/block`, eStatus,{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return {data: response.data, status: response.message}
        }catch(e){
            console.log(e)
            return { error: "Có lỗi khi lấy dữ liệu. Vui lòng thử lại sau!" };
        }
    },

    async GetAllReevaluationOfStudent(studentId, listYear) {
        try {
            //console.log("Fetching absence data for student ID:", studentId, "for years:", listYear);
            const response = await axiosInstance.get(`/Reevaluation/student/${studentId}/years`,
                {
                    params: {
                        listYear: listYear, // Axios sẽ tự encode thành ?years=2022&years=2023
                    },
                    paramsSerializer: (params) => {
                        return qs.stringify(params, { arrayFormat: "repeat" });
                        // => listYear=2023-2024&listYear=2024-2025...
                    },
                }
            );
            const { data, status, error } = response.data;
            if (error) {
                throw new Error(error);
            }
            return { data, status };
        } catch (error) {
            console.error("Error fetching attendance by student ID:", error);
            throw new Error(error.response?.data?.message || "An unexpected error occurred");
        }
    },
};
export default ReevaluationService;