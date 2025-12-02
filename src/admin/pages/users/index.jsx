/* eslint-disable react/jsx-key */
import { Dropdown } from "antd";
import AdminPageLayout from "../../layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { routePath } from "../../../config";
import { MoreOutlined } from "@ant-design/icons";
import EduBuddyTable from "../../layout/table";

const BASE_URL = import.meta.env.VITE_URL;

export default function UsersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/users?entityType=all&entity=users`
      );
      setData(response.data.results);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Sl No",
      dataIndex: "sl_no",
      key: "sl_no",
      align: "center",
      render: (_, __, index) => index + 1,
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "View",
                onClick: () =>
                  navigate(`${routePath.viewUser}/${record.entityId}`),
              },
              {
                key: "2",
                label: "Edit",
                onClick: () =>
                  navigate(`${routePath.editUser}/${record.entityId}`),
              },
              {
                key: "3",
                label: "Delete",
                onClick: async () => {
                  setLoading(true);
                  try {
                    const response = await axios.delete(
                      `${BASE_URL}/delete-entity?entity=users&entityId=${record.entityId}`
                    );
                    console.log(response);
                    setRefresh((prev) => prev + 1);
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setLoading(false);
                  }
                },
              },
            ],
            style: { width: "100px", textAlign: "center" },
          }}
          trigger={["click"]}
        >
          <MoreOutlined className="cursor-pointer text-lg" />
        </Dropdown>
      ),
    },
    {
      title: "Name",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => text || "NIL",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (text) => text || "NIL",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
  ];

  useEffect(() => {
    fetchData();
  }, [location.pathname, refresh]);

  return (
    <AdminPageLayout
      title="Users"
      // actions={[
      //     <Button onClick={() => navigate(routePath.addUser)} style={{ background: "#6d28d9", border: "none" }} type="primary">
      //         Add User
      //     </Button>
      // ]}
    >
      <div className="h-full flex flex-col">
        <EduBuddyTable data={data} columns={columns} loading={loading} />
        <Outlet context={{ refreshData: fetchData }} />
      </div>
    </AdminPageLayout>
  );
}
