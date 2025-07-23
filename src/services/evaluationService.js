import { data } from "react-router-dom";
import axiosInstance from "../tools/axios.tool";
const EvalutationService = {
    async GetStudentEvaluation({studentId, year, semester}){
        try{
            const response = await axiosInstance.get(`/Evaluation/student/${studentId}?year=${year}&semester=${semester}`);
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
        }
    },

    async CreateStudentEvaluation({studentId, year, semester, comment}){
        try{
            console.log(semester);
            const response = await axiosInstance.post(`/Evaluation/student/${studentId}`,{
                year,
                semester,
                Evaluation_Content: comment
            });
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
        }
    },

    async UpdateStudentEvaluation({studentId, year, semester, comment}){
        try{
            console.log(semester);
            const response = await axiosInstance.put(`/Evaluation/student/${studentId}`,{
                year,
                semester,
                Evaluation_Content: comment
            });
            return {data: response.data, status: response.status}
        }catch(e){
            console.log(e);
        }
    }
};

export default EvalutationService;