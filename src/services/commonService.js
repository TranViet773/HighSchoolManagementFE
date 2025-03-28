import { Upload } from "antd";
import axiosInstance, { service } from "../tools/axios.tool";

const ImportService = {
  async uploadExcel(file, eRole) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", String(eRole));
    const response = await axiosInstance.post("/Auth/import-excel", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { data, status, error } = await service(response);
    if (error) {
      throw error;
    }
    return { data, status };
  },

  async UploadImage(file) {
    const formData = new FormData();
    formData.append("file", file); // "file" phải đúng với backend yêu cầu

    const response = await axiosInstance.post("/Upload/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return { data: response.data, status: response.status };
  }
};

export default ImportService;
