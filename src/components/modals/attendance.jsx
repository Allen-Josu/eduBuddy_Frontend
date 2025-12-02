import { Button, Modal, Select, Space } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useUserStore } from "../../store/userStore";
import { v4 as uuid } from "uuid";
import ToastNotification from "./Toast";

const BASE_URL = import.meta.env.VITE_URL;

export default function AttendanceModal({
  showModal,
  setShowModal,
  selectedDate,
  onSuccess,
}) {
  const [data, setData] = useState();
  const [leaveData, setLeaveData] = useState([]);
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const date = dayjs(selectedDate).format("YYYY-MM-DD");

  const handleCancel = () => {
    setIsDataAvailable(false);
    setLeaveData([]);
    setShowModal(false);
  };

  const fetchData = async () => {
    const { email } = user;
    try {
      if (date) {
        const response = await axios.get(
          `${BASE_URL}/attendance?email=${email}&leaveDate=${date}`
        );
        setData(response.data.results[0]);
        setLeaveData(response.data.results[0]?.leavePerDay || []);
        setIsDataAvailable(response.data.results.length > 0);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchData();
    }
  }, [showModal]);

  const SelectOptions = [
    { label: "Present", value: "Present" },
    { label: "Sick Leave", value: "Sick Leave" },
    { label: "Absent", value: "Absent" },
    { label: "Duty Leave", value: "Duty Leave" },
    { label: "No Class", value: "No Class" },
  ];

  const handleSelect = (value, time) => {
    if (value === "Present") {
      setLeaveData((prev) => prev?.filter((item) => item.time !== time) || []);
      return;
    }

    const existingIndex =
      leaveData?.findIndex((item) => item.time === time) ?? -1;

    if (existingIndex !== -1) {
      setLeaveData(
        (prev) =>
          prev?.map((item, index) =>
            index === existingIndex ? { ...item, reason: value } : item
          ) || []
      );
    } else {
      setLeaveData((prev) => [
        ...(prev || []),
        {
          time: time,
          reason: value,
        },
      ]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isDataAvailable) {
        const attendancePayload = {
          entity: "attendance",
          entityId: data.entityId,
          leaveDate: date,
          attributesToUpdate: {
            leavePerDay: leaveData,
            totalLeavePerDay: leaveData.length,
          },
        };
        await axios.patch(`${BASE_URL}/update-entity`, attendancePayload);
      } else {
        const attendancePayload = {
          entity: "attendance",
          entityId: uuid(),
          username: user.username,
          email: user.email,
          leaveDate: date,
          leavePerDay: leaveData,
          totalLeavePerDay: leaveData.length,
        };
        await axios.post(`${BASE_URL}/attendance`, attendancePayload);
      }
      setToastOpen(true);
      onSuccess?.();
      handleCancel();
    } catch (error) {
      console.error("Error submitting attendance:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    { time: "9:00", label: "9:00 am" },
    { time: "10:00", label: "10:00 am" },
    { time: "11:00", label: "11:00 am" },
    { time: "12:00", label: "12:00 pm" },
    { time: "2:00", label: "2:00 pm" },
    { time: "3:00", label: "3:00 pm" },
  ];

  return (
    <>
      <Modal
        title={`Attendance Marker ${date}`}
        open={showModal}
        onCancel={handleCancel}
        footer={
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ background: "#6d28d9" }}
            loading={isSubmitting}
          >
            Mark Attendance
          </Button>
        }
      >
        <div className="flex justify-between items-center">
          <Space direction="vertical" className="w-full mt-3">
            {timeSlots.map(({ time, label }) => (
              <div key={time} className="w-full flex justify-between">
                <p className="font-semibold">{label}</p>
                <Select
                  value={
                    leaveData?.find((item) => item.time === time)?.reason ||
                    "Present"
                  }
                  options={SelectOptions}
                  onChange={(value) => handleSelect(value, time)}
                  className="w-56"
                />
              </div>
            ))}
          </Space>
        </div>
      </Modal>
      <ToastNotification
        open={toastOpen}
        setOpen={setToastOpen}
        message="Attendance marked successfully!"
      />
    </>
  );
}
