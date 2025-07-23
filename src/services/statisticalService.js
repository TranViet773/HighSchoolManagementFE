import axiosInstance from "../tools/axios.tool";

const StatisticalService = {
    async getAllStatistical(year) {
        try {
            const response = await axiosInstance.get(`StatisticalAndReport/general?year=${year}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            console.error("Error fetching all statistics", error);
            throw error;
        }
    },

    async StatisticalResultOfGradeAsync(year, grade) {
        try {
            const response = await axiosInstance.get(`StatisticalAndReport/result-of-grade?year=${year}&grade=${grade}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            console.error("Error fetching statistical result of grade", error);
            throw error;
        }
    },

    async StatisticalResultOfGradeByYearsAsync(year, grade) {
        try {
            const response = await axiosInstance.get(`StatisticalAndReport/result-of-grade-by-years?year=${year}&grade=${grade}`);
            return { data: response.data, status: response.status };
        } catch (error) {
            console.error("Error fetching statistical result of grade", error);
            throw error;
        }
    }
};
export default StatisticalService;