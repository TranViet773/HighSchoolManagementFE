import {Layout} from "antd";
import Sidebar from "../../components/SideBarComponent/SidebarComponent";
const HomeParentPage=()=>{
    return(
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar /> {/* Sidebar ở bên trái */}
            <Layout>
                <h1>Nội dung Phụ Huynh</h1>
            </Layout>
        </Layout>
    );
}

export default HomeParentPage;