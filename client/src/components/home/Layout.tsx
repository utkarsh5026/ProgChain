import { Layout as AntLayout } from "antd";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const { Content } = AntLayout;

const Layout: React.FC = () => {
  return (
    <StyledLayout>
      <Sidebar />
      <MainContent>
        <Content style={{ padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </MainContent>
    </StyledLayout>
  );
};

const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
  width: 100vw;
`;

const MainContent = styled(AntLayout)`
  margin-left: 80px; // Width of the collapsed sidebar
  overflow-y: auto;
  height: 100vh;
`;

export default Layout;
