import React, { useEffect, useState } from 'react';
import SidebarTeacher from '../../../components/SideBarComponent/SideBarTeacher';
import { Input, Layout, Segmented, Select, Table, Button, Radio, Tag, Space, Modal, Descriptions } from 'antd';
import { SignatureFilled, InfoCircleOutlined } from "@ant-design/icons";
import ReevaluationService from '../../../services/reevaluationService';
import getCurrentYear from '../../../utils/year.util';
import { toast } from 'react-toastify';
import { getInforJwt } from '../../../tools/utils';
import moment from 'moment';
import ReevaluationModal from './components/UpdateReevaluationModal';

const { Content } = Layout;
const { schoolYear, listYear } = getCurrentYear();
const { Option } = Select;
const pageSize = 10;
const teacherId = getInforJwt().Id;
const ReevaluationPage = () => {
  const [reevaluationData, setReevaluationData] = useState([]); 
  const [selectedReevaluation, setSelectedReevaluation] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("1");
  const [selectedYear, setSelectedYear] = useState(schoolYear)
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchReevaluationData(selectedStatus, teacherId);
  },[selectedStatus, selectedYear, visible]);

  const fetchReevaluationData = async () => {
    try{
      const {data, error} = await ReevaluationService.GetReevaluationByTeacher(selectedStatus, teacherId, schoolYear);
      if(error){
        console.log(error)
        toast.error("Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau!");
      } else{
        //console.log(data);
        setReevaluationData(data.data);
      }
    } catch(e){
      toast.error(e);
    }
  }

  const handleOpenModal = async (reevaluationData) => {
    console.log(reevaluationData)
    setSelectedReevaluation(reevaluationData);
    setVisible(true);
  }

  const handleUpdateRevaluation = async (data) => { //Guid editorId, string year, int semester, double score, Guid ReevaluationId
    console.log(data);
    const {reevaluation_Id, reevaluation_AfterScore, status} = data;
    try{
      const {data, error} = await ReevaluationService.UpdateReevaluationAsync(reevaluation_Id, reevaluation_AfterScore, status);
      if(error || data.code != "200"){
        toast.error(error ? error : data.message);
      }else{
        console.log(data)
        setVisible(false);
        toast.success("Cập nhật thông tin thành công!");
      }
    }catch(e){
      console.log(e);
      toast.error("Có lỗi khi cập nhật. Vui lòng thử lại sau!");
    }
  }
  
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Người thực hiện",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Email",
      dataIndex: "studentEmail",
      key: "studentEmail",
    },
    {
      title: "Thời gian thực hiện",
      dataIndex: "reevaluation_TimestampRequest",
      key: "reevaluation_TimestampRequest",
      render: (value) =>
        value ? moment(value).format("DD/MM/YYYY HH:mm") : "N/A",
    },
    {
      title: "Cột điểm",
      dataIndex: "reevaluation_ScoreColumn",
      key: "reevaluation_ScoreColumn",
    },
    {
      title: "Điểm ban đầu",
      dataIndex: "reevaluation_PreScore",
      key: "reevaluation_PreScore",
    },
    {
      title: "Lý do",
      dataIndex: "reevaluation_Reason",
      key: "reevaluation_Reason",
    },
    {
      title: "Trạng thái",
      dataIndex: "reevaluation_Status",
      key: "reevaluation_Status",
      render: (status) => {
        const statusMap = {
          0: { text: "Chờ duyệt", color: "orange" },
          1: { text: "Đã duyệt", color: "blue" },
          2: { text: "Hoàn thành", color: "green" },
          3: { text: "Đã hủy", color: "red" },
          5: { text: "Đang chỉnh sửa", color: "yellow" },
        };
        const item = statusMap[status] || { text: "Không rõ", color: "gray" };
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        record.reevaluation_Status == 1 ?
        (
          <Space>
            <SignatureFilled
              onClick={(event) => {
                event.stopPropagation();
                handleOpenModal(record);
              }}
              style={{
                color: "green",
                fontSize: "20px",
                cursor: "pointer",
                transition: "transform 0.9s",
              }}
              className="hover:scale-115 ml-6"
            />
          </Space>
        ) : (
          <Space>
            <InfoCircleOutlined
              onClick={(event) => {
                event.stopPropagation();
                handleOpenModal(record);
              }}
              style={{
                color: "green",
                fontSize: "20px",
                cursor: "pointer",
                transition: "transform 0.9s",
              }}
              className="hover:scale-115 ml-6"
            />
          </Space>
        )
      ),
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <SidebarTeacher />
      <Layout style={{ padding: "20px", background: "#fff" }}>
        <Content>
          <div className="flex justify-between items-center mt-5">
            {/* Bên trái: Select, Input, Button */}
            {/* <div className="flex items-center gap-3">
              <Select
                className="w-42"
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
              >
                {listYear.map((year) => (
                  <Option value={year} key={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </div> */}

            {/* Bên phải: Radio Group */}
            <Radio.Group
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <Radio.Button value="1">Đã Duyệt</Radio.Button>
              <Radio.Button value="5">Đang Chỉnh Sửa</Radio.Button>
              <Radio.Button value="2">Đã Hoàn Thành</Radio.Button>
            </Radio.Group>
          </div>

          <Table
            columns={columns}
            bordered
            dataSource={reevaluationData}
            rowKey="reevaluation_Id"
            className="shadow-lg rounded-md mt-2"
            pagination={{
              pageSize,
              onChange: (page) => setCurrentPage(page),
            }}
          />
        </Content>
        {/* Modal ở đây */}
        {selectedReevaluation && 
          <ReevaluationModal
            visible={visible}
            setVisible={setVisible}
            data={selectedReevaluation!=null ? selectedReevaluation : null}
            onSave={(updatedRecord) => handleUpdateRevaluation(updatedRecord)}
          />
        }
      </Layout>
    </Layout>
  )
}

export default ReevaluationPage;
