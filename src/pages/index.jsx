import { Layout } from "antd";
import Sidebar from "../components/SideBarComponent/SidebarComponent";
const HomePage = () => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar /> {/* Sidebar ở bên trái */}
          <Layout>
            <h1>Nội dung</h1>
          </Layout>
        </Layout>
      );
    };
export default HomePage;