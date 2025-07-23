import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/SideBarComponent/SidebarComponent';
import { Input, Layout, Segmented, Select, Table, Button, Radio } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import ReevaluationComponent from '../Submittion/Components/ReevaluationComponent';
import ReevaluationService from '../../services/reevaluationService';
import getCurrentYear from '../../utils/year.util';
import { toast } from 'react-toastify';
import DetailReevaluationComponent from './Components/DetailReevaluationComponent';

const { Content } = Layout;
const { schoolYear, listYear } = getCurrentYear();
const { Option } = Select;

const Reevaluation = () => {
  const [selectedTab, setSelectedTab] = useState("Phúc khảo điểm số");
  const [reevaluationData, setReevaluationData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("0");
  const [selectedYear, setSelectedYear] = useState(schoolYear);
  const [selectedItem, setSelectedItem] = useState(null)
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchReevaluationData();
  }, [selectedStatus, selectedYear, query]);

  const fetchReevaluationData = async () => {
    try {
      const { data, message, error } = await ReevaluationService.GetReevaluationByYearAndStatus(
        selectedStatus,
        selectedYear,
        query
      );
      console.log(data);
      if (error) {
        toast.error("Có lỗi khi lấy dữ liệu. Vui lòng thử lại!");
      } else {
        setReevaluationData(data.data); // nếu data là mảng kết quả
      }
    } catch (e) {
      console.log(e);
      toast.error("Lỗi hệ thống.");
    }
  };

  const handleBack = () => {
    setSelectedItem(null)
  }

  const handleFetchReevaluationDataById = async (id) => {
    try{
      const {data, error} = await ReevaluationService.GetReevaluationById(id);
      if(error)
        toast.error(error);
      else{
        setSelectedItem(data.data);
      }
    }catch(e){
      toast.error(e);
    }
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ padding: "20px", background: "#fff" }}>
        <Content>
          <Segmented
            options={["Phúc khảo điểm số", "Duyệt yêu cầu của giảng viên"]}
            value={selectedTab}
            onChange={setSelectedTab}
          />
          {selectedTab === "Phúc khảo điểm số" && (
            <>
              {!selectedItem ? 
                (<>
                  <div className="flex justify-between items-center mt-5">
                    {/* Bên trái: Select, Input, Button */}
                    <div className="flex items-center gap-3">
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
                      <Input
                        className="w-40"
                        placeholder="Tìm theo tên..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <Button icon={<SearchOutlined />} onClick={fetchReevaluationData} />
                    </div>

                    {/* Bên phải: Radio Group */}
                    <Radio.Group
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <Radio.Button value="0">Đang chờ duyệt</Radio.Button>
                      <Radio.Button value="1">Đã Duyệt</Radio.Button>
                      <Radio.Button value="5">Đang Cập Nhật</Radio.Button>
                      <Radio.Button value="2">Đã Hoàn Thành</Radio.Button>
                      <Radio.Button value="3">Đã Hủy</Radio.Button>
                      <Radio.Button value="6">Đã Bị Chặn</Radio.Button>
                    </Radio.Group>
                  </div>

                  <ReevaluationComponent data={reevaluationData} onSelectedItem={handleFetchReevaluationDataById}/>
                </> )
                :
                (<DetailReevaluationComponent item={selectedItem} onBack={handleBack} />)
              }
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Reevaluation;
