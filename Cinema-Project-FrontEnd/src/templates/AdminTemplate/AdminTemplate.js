import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const { Header, Sider, Content } = Layout;

const AdminTemplate = () => {
  const { userInfo } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();

  useEffect(() => {
    if (userInfo) {
      if (userInfo?.user_type === "customer") {
        navigate("/login");
      }
      if (userInfo?.user_type !== "admin") {
        window.location.href = "https://www.google.com";
      }
    }
  }, [location.pathname, navigate, userInfo]);

  return (
    <Layout className="min-h-screen!">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={`${location.pathname}`}
          items={[
            {
              key: "/admin/manager_user",
              icon: <UserOutlined />,
              label: <Link to={"/admin/manager_user"}>User Management</Link>,
            },
            {
              key: "/admin",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/admin"}>Movie Management</Link>,
            },
            {
              key: "/admin/add_movie",
              icon: <VideoCameraOutlined />,
              label: <Link to={"/admin/add_movie"}>Create Movie</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminTemplate;
