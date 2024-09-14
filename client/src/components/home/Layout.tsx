import { Layout as AntLayout } from "antd";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
const { Content } = AntLayout;

const Layout: React.FC = () => {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <AntLayout>
        <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
