import { Button, Form, Input, Select } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuid } from "uuid";
import Header from "../../components/Header";
import ToastNotification from "../../components/modals/Toast";

const BASE_URL = import.meta.env.VITE_URL;

function Signup() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const courseOptions = [
    { value: "MCA", label: "MCA" },
    { value: "MSC CS-DS", label: "MSC CS-DS" },
    { value: "MSC CS-AI", label: "MSC CS-AI" },
  ];

  const handleSubmit = async (values) => {
    setError("");
    setLoading(true);

    try {
      const { ...dataToSend } = values;

      await axios.post(`${BASE_URL}/users/`, {
        ...dataToSend,
        entityId: uuid(),
        entity: "users",
        role: "user",
        department: "DCA",
      });

      await axios.post(`${BASE_URL}/send-otp`, { email: dataToSend.email });

      setToastMessage("An OTP has been sent to your email");
      setToastOpen(true);
      setTimeout(() => navigate("/verify-otp"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div
        style={{
          backgroundColor: "#27272A",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <div
          className="card shadow-lg"
          style={{
            maxWidth: "500px",
            width: "100%",
            backgroundColor: "#ffffff",
            borderRadius: "15px",
            padding: "2rem",
          }}
        >
          <h2
            className="text-center pb-4"
            style={{
              fontSize: "1.75rem",
              fontWeight: "bold",
              color: "#6d28d9",
            }}
          >
            Sign Up
          </h2>
          {error && (
            <div
              className="alert alert-danger"
              style={{
                fontSize: "0.875rem",
                marginBottom: "1rem",
                borderRadius: "8px",
                padding: "0.75rem",
              }}
            >
              {error}
            </div>
          )}
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            style={{ padding: "0 1rem" }}
          >
            <Form.Item
              name="username"
              label={
                <span style={{ fontWeight: "500", color: "#333" }}>
                  Username
                </span>
              }
              rules={[
                { required: true, message: "Please input your username!" },
                {
                  pattern: /^[A-Za-z\s]+$/,
                  message: "Username must contain only letters!",
                },
              ]}
            >
              <Input
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "2px solid #6d28d9",
                  borderRadius: "8px",
                  padding: "0.8rem",
                  height: "40px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label={
                <span style={{ fontWeight: "500", color: "#333" }}>Email</span>
              }
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "2px solid #6d28d9",
                  borderRadius: "8px",
                  padding: "0.8rem",
                  height: "40px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="course"
              label={
                <span style={{ fontWeight: "500", color: "#333" }}>Course</span>
              }
              rules={[
                { required: true, message: "Please select your course!" },
              ]}
            >
              <Select
                options={courseOptions}
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "2px solid #6d28d9",
                  borderRadius: "8px",
                  height: "40px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span style={{ fontWeight: "500", color: "#333" }}>
                  Password
                </span>
              }
              rules={[
                { required: true, message: "Please input your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character!",
                },
              ]}
            >
              <Input.Password
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "2px solid #6d28d9",
                  borderRadius: "8px",
                  padding: "0.8rem",
                  height: "40px",
                  fontSize: "14px",
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={
                <span style={{ fontWeight: "500", color: "#333" }}>
                  Confirm Password
                </span>
              }
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "2px solid #6d28d9",
                  borderRadius: "8px",
                  padding: "0.8rem",
                  height: "40px",
                  fontSize: "14px",
                }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              className="w-100"
              style={{
                backgroundColor: "#6d28d9",
                color: "#fff",
                border: "none",
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "0.85rem 1.5rem",
                borderRadius: "8px",
              }}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </Form>

          <div
            className="text-center mt-4"
            style={{
              fontSize: "0.9rem",
              marginTop: "1.5rem",
            }}
          >
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#6d28d9",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
              >
                Click here to log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastNotification
        open={toastOpen}
        setOpen={setToastOpen}
        message={toastMessage}
      />
    </div>
  );
}

export default Signup;
