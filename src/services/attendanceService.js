import axiosInstance, { service } from "../tools/axios.tool";
import qs from "qs";
const AttendanceService = {
    async CreateListAttendance(listAttendance) {
        try {
            console.log("Dữ liệu JSON cần gửi:", listAttendance);
            const response = await axiosInstance.post("/Attendances/list", listAttendance);
            const { data, status, error } = response.data;
            if (error) {
                throw new Error(error);
            }
            return { data, status };
        } catch (error) {
            console.error("Error creating attendance list:", error);
            throw new Error(error.response?.data?.message || "An unexpected error occurred");
        }
    },

    async GetAttendanceByClassAndDate({ classId, date, year }) {
        try {
            const response = await axiosInstance.get(`/Attendances/class/${classId}/date?date=${date}&year=${year}`, );
            const { data, status, error } = response.data;
            if (error) {
                throw new Error(error);
            }
            return { data, status };
        } catch (error) {
            console.error("Error fetching attendance by class and date:", error);
            throw new Error(error.response?.data?.message || "An unexpected error occurred");   
        }
    },

    async GetAttendanceByClassAndWeek({ classId, date, year }) {
        try {
            const response = await axiosInstance.get(`/Attendances/class/${classId}/week?date=${date}&year=${year}`, );
            const { data, status, error } = response.data;
            if (error) {
                throw new Error(error);
            }
            return { data, status };
        } catch (error) {
            console.error("Error fetching attendance by class and week:", error);
            throw new Error(error.response?.data?.message || "An unexpected error occurred");   
        }
    },
    
    async GetAttendancesByClass({ classId, year }) {
        try {
            const response = await axiosInstance.get(`/Attendances/class/${classId}?year=${year}`);
            const { data, status, error } = response.data;
            if (error) {
                throw new Error(error);
            }
            return { data, status };
        } catch (error) {
            console.error("Error fetching attendances by class:", error);
        }
    },

    async DeleteAttendanceById(attendanceId) {
        try {
            const response = await axiosInstance.delete(`/Attendances/${attendanceId}`);
            const { data, status, error } = response.data;
            if (error) {
                throw new Error(error);
            }
            return { data, status };
        } catch (error) {
            console.error("Error deleting attendance by ID:", error);
            throw new Error(error.response?.data?.message || "An unexpected error occurred");
        }
    },

    async GetAttendanceByStudentId(studentId, year) {
        try {
            const response = await axiosInstance.get(`/Attendances/student/${studentId}?year=${year}`);
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

    async GetAbsenceStatisticsForTheMonth(classId, year) {
        try {

            const response = await axiosInstance.get(`/Attendances/statistics/class/${classId}?year=${year}`);
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

    async GetAllAbsenceOfStudent(studentId, listYear) {
        try {
            //console.log("Fetching absence data for student ID:", studentId, "for years:", listYear);
            const response = await axiosInstance.get(`/Attendances/all-year/student/${studentId}`,
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
export default AttendanceService;
