import React, {useEffect, useState} from 'react'
import {Row, Col, Card, Input} from "antd";
import ClassService from '../../../../services/classService';
import { getInforJwt } from '../../../../tools/utils';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const { Search } = Input;


const ListClassComponent = ({selectedYear}) => {
    const id = getInforJwt().Id;
    const [searchTerm, setSearchTerm] = useState('');
    const [classData, setClassData] = useState([]);

    useEffect(() => {
        fetchClassData();
    }, [selectedYear]);

    const fetchClassData = async () => {
      try {
        console.log({selectedYear})
        const { data } = await ClassService.getClassByTeacher({
          id: id,
          year: selectedYear,
          semester: "all"
        });
        console.log("Class By teacher", data);
        if(data.data !=null && data?.data.length > 0){
          const formattedData = data.data.map(item => ({
              subject: item.subject_Name,
              subjectId: item.subject_Id,
              classTitle: item.classes_Name, 
              class_Id: item.classes_Id,       
              schoolYear: item.year,             
              bg: `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}` 
          }));
          setClassData(formattedData);
        }
        if(data.data == null){
          setClassData([]);
        }
      }catch(error){
        console.log("Lỗi: " + error);
        toast.error("Lỗi khi tải dữ liệu lớp. Vui lòng thử lại!");
      }
    }
    // Lọc dữ liệu theo tên lớp (classTitle)
    const filteredData = classData.filter(item =>
      item.classTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );


  return (
    <div>
      {/* Ô tìm kiếm */}
      <Row style={{ marginBottom: 20 }}>
            <Col span={24}>
              <Search
                placeholder="Tìm kiếm theo lớp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                enterButton
              />
            </Col>
          </Row>
          {/* Danh sách card */}
          <Row gutter={[16, 16]}>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => ( 
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  <Link to={`/teacher/teaching/class/${item.class_Id}/year/${selectedYear}/subject/${item.subjectId}`} >
                  <Card
                    hoverable
                    style={{ borderRadius: '8px', overflow: 'hidden' }}
                    cover={
                      <div
                        style={{
                          height: 150,
                          backgroundImage: `url(${item.bg})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    }
                    bodyStyle={{ backgroundColor: '#1E293B', color: '#fff', padding: '12px' }}
                  >
                    <h3 style={{ margin: 0, color: '#FBBF24' }}>
                      {item.subject} - {item.classTitle}
                    </h3>
                    <p style={{ margin: 0, color: '#CBD5E1' }}>{item.schoolYear}</p>
                  </Card> 
                  </Link>
                </Col>
              ))
            ) : (
              <Col span={24}>
                <p style={{ textAlign: 'center', color: '#999' }}>
                  Không tìm thấy lớp phù hợp.
                </p>
              </Col>
            )}
          </Row>
    </div>
  )
}

export default ListClassComponent
