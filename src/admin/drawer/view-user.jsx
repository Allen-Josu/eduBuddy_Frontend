import { Card, Drawer, Space } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_URL;

export default function ViewUser() {
  const [data, setData] = useState(null);

  const { entityId } = useParams();
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users?entity=users&entityType=single&entityId=${entityId}`
        );
        setData(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [entityId]);
  return (
    <>
      <Drawer width={600} title="View Department" onClose={onClose} open>
        <Space direction="vertical" className="w-full gap-10">
          <Card>
            <Card.Grid hoverable={false} style={{ width: "35%" }}>
              Name
            </Card.Grid>
            <Card.Grid hoverable={false} style={{ width: "65%" }}>
              {data?.username}
            </Card.Grid>
            {data?.role != "admin" && (
              <>
                <Card.Grid hoverable={false} style={{ width: "35%" }}>
                  Email
                </Card.Grid>
                <Card.Grid hoverable={false} style={{ width: "65%" }}>
                  {data?.email}
                </Card.Grid>
                <Card.Grid hoverable={false} style={{ width: "35%" }}>
                  Department
                </Card.Grid>
                <Card.Grid hoverable={false} style={{ width: "65%" }}>
                  {data?.department}
                </Card.Grid>
                <Card.Grid hoverable={false} style={{ width: "35%" }}>
                  Course
                </Card.Grid>
                <Card.Grid hoverable={false} style={{ width: "65%" }}>
                  {data?.course}
                </Card.Grid>
              </>
            )}

            <Card.Grid hoverable={false} style={{ width: "35%" }}>
              Role
            </Card.Grid>
            <Card.Grid hoverable={false} style={{ width: "65%" }}>
              {data?.role}
            </Card.Grid>
          </Card>
        </Space>
      </Drawer>
    </>
  );
}
