import React from "react";
import { Layout, Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOutlined,
  UsergroupAddOutlined,
  FormOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuProps["items"] = [
    {
      key: "/topics",
      icon: <BookOutlined />,
      title: "Topics",
    },
    {
      key: "/interview",
      icon: <UsergroupAddOutlined />,
      title: "Interview",
    },
    { key: "/quiz", icon: <FormOutlined />, title: "Quiz" },
  ];

  const handleeMenuItemClick = (key: string) => {
    navigate(key);
  };

  return (
    <GradientSider collapsed={true}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        theme="dark"
        onClick={(info) => handleeMenuItemClick(info.key)}
      />
    </GradientSider>
  );
};

const GradientSider = styled(Sider)`
  &&& {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    background-size: 400% 400%;
    animation: gradient 10s ease infinite;
  }

  .ant-menu {
    background: transparent;
  }

  .ant-menu-item {
    margin: 10px 0;
    border-radius: 0 20px 20px 0;
    transition: all 0.3s ease;

    &:hover,
    &.ant-menu-item-selected {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
    }
  }

  .anticon {
    font-size: 1.2em;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

export default Sidebar;
