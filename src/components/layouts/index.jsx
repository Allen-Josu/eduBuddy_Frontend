/* eslint-disable react/prop-types */
import { Button, Flex, Layout, Select, Spin } from "antd";
import { Album, ChevronRight, Heart, User2 } from "lucide-react";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import axios from "axios";
import Modals from "../modals/add-layoutdata";
import { SemesterSelectOption } from "../../admin/constants";
import { useUserStore } from "../../store/userStore";

const { Content } = Layout;
const layoutStyle = {
  width: "100vh",
};

const BASE_URL = import.meta.env.VITE_URL;

// Utility function to check if entity is liked by user
const isEntityLikedByUser = (entityId, likedEntities) => {
  return likedEntities.some((item) => item.entityId === entityId);
};

export default function PageLayout({ title, entity }) {
  const [menuData, setMenuData] = useState({
    course: "MCA",
    semester: "I_Semester",
  });
  const [courseOptions, setCourseOptions] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [active, setActive] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [userLikedEntity, setUserLikedEntity] = useState([]);

  const user = useUserStore((state) => state.user);

  const handleSubjectClick = (subjectLabel) => {
    setActive(subjectLabel);
    setIsMobileMenuOpen(false);
  };

  // Fetch departments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/departments?entity=departments`
        );
        setResponseData(response.data.results || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/newEntity?entity=${entity}&entityType=all`
        );
        setData(response.data.results);
      } catch (error) {
        console.error("Error fetching entity data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, entity]);


  useEffect(() => {
    const fetchUserLikedEntities = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `${BASE_URL}/users?entity=users&email=${user.email}&entityType=single&entityId=${user.entityId}`
        );
        setUserLikedEntity(response.data.results.likedEntities || []);
      } catch (error) {
        console.error("Error fetching user liked entities:", error);
      }
    };

    fetchUserLikedEntities();
  }, [user, refresh]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = [
          ...new Set(responseData.map((item) => item.course)),
        ].map((course) => ({
          label: course,
          value: course,
        }));
        setCourseOptions(courses);

        const firstItem = responseData.find(
          (item) =>
            item.course === menuData.course &&
            item.semester === menuData.semester
        );

        if (firstItem?.subjects?.length > 0) {
          setActive(firstItem.subjects[0].subjectName);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [menuData.course, menuData.semester, responseData]);

  const handleLikeClicked = async (e, entityId, likes) => {
    e.stopPropagation();

    if (!user) return;

    try {
      const isLiked = isEntityLikedByUser(entityId, userLikedEntity);

      // Prepare updated liked entities
      const updatedUserLikedEntities = isLiked
        ? userLikedEntity.filter((item) => item.entityId !== entityId)
        : [...userLikedEntity, { entityId, entity }];

      // Prepare payloads
      const payloads = {
        entity: {
          entity,
          entityId,
          attributesToUpdate: {
            likes: likes + (isLiked ? -1 : 1),
          },
        },
        user: {
          entity: "users",
          entityId: user.entityId,
          attributesToUpdate: {
            likedEntities: updatedUserLikedEntities,
          },
        },
      };

      // Optimistic update
      setUserLikedEntity(updatedUserLikedEntities);
      setData((prevData) =>
        prevData.map((item) =>
          item.entityId === entityId
            ? { ...item, likes: likes + (isLiked ? -1 : 1) }
            : item
        )
      );

      // Make API calls in parallel
      await Promise.all([
        axios.patch(`${BASE_URL}/update-entity`, payloads.entity),
        axios.patch(`${BASE_URL}/update-entity`, payloads.user),
      ]);
    } catch (error) {
      console.error("Error updating likes:", error);
      // Revert optimistic updates on error
      setUserLikedEntity(userLikedEntity);
      setData((prevData) =>
        prevData.map((item) =>
          item.entityId === entityId ? { ...item, likes } : item
        )
      );
    }
  };

  const filteredData = data?.filter((item) => item.subjectName === active);

  return (
    <>
      <Flex gap="middle" wrap="wrap" className="min-h-screen">
        <Layout style={layoutStyle}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full px-4 md:px-8 lg:px-20 py-4 md:h-20 text-white bg-[#27272a] border-b-2 border-[#393939] gap-4">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
              {title}
            </h3>
            <div className="flex flex-col md:flex-row gap-4 md:w-auto w-full">
              {user && (
                <Button
                  type="primary"
                  style={{
                    background: "#6d28d9",
                    width: "200px",
                    border: "none",
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Add {title === "PYQ" ? "Previous Questions" : title}
                </Button>
              )}
              <Select
                className="w-full md:w-48"
                value={menuData.course}
                options={courseOptions}
                placeholder="Select Course"
                onChange={(value) =>
                  setMenuData({ ...menuData, course: value })
                }
              />
              {menuData.course && (
                <Select
                  className="w-full md:w-48"
                  options={SemesterSelectOption}
                  value={menuData.semester}
                  placeholder="Select Semester"
                  onChange={(value) =>
                    setMenuData({
                      ...menuData,
                      semester: value,
                    })
                  }
                />
              )}
            </div>
          </div>

          <Layout className="relative">
            {/* Backdrop Overlay */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden fixed top-24 right-4 z-50 bg-[#6d28d9] p-2 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ChevronRight
                className={`text-white transform transition-transform ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Sidebar */}
            <Sider
              width={`${isMobileMenuOpen ? "50%" : "25%"}`}
              className={`bg-[#27272a] md:relative lg:max-w-2xl fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0`}
            >
              <div className="p-4 flex flex-col w-full gap-6 border-r-2 h-full border-[#393939] overflow-y-auto">
                {responseData
                  .filter(
                    (item) =>
                      item.course === menuData.course &&
                      item.semester === menuData.semester
                  )
                  .map((item, index) =>
                    item.subjects?.map((subject, subIndex) => (
                      <div
                        key={`${index}-${subIndex}`}
                        onClick={() => handleSubjectClick(subject.subjectName)}
                        className={`flex justify-between items-center w-full p-3 border-b-2 border-[#393939] hover:bg-[#6d28d9] cursor-pointer transition duration-300 ease-in rounded-lg
                          ${
                            active === subject.subjectName ? "bg-[#6d28d9]" : ""
                          }`}
                      >
                        <h4 className="text-[#c1c3c8] text-sm md:text-base">
                          {subject.subjectName}
                        </h4>
                        <ChevronRight className="text-white" />
                      </div>
                    ))
                  )}
              </div>
            </Sider>

            {/* Main Content */}
            <Content className="bg-[#27272a] w-full md:w-3/4 h-min-full">
              <div
                className="flex flex-col p-4 md:p-8 lg:px-16"
                style={{
                  overflowY: "auto",
                  height: "calc(100vh - 80px)",
                  scrollbarWidth: "none",
                }}
              >
                <div className="flex justify-between items-center w-full font-bold px-10 text-lg md:text-xl mt-6 text-[#c1c3c8]">
                  <p>{title}</p>
                  <p>Shared By</p>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Spin size="large" />
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-64 text-red-900 font-bold text-xl">
                    {error}
                  </div>
                ) : filteredData && filteredData.length > 0 ? (
                  <div className="space-y-4 mt-6 px-10 py-3">
                    {filteredData
                      .sort((a, b) => b.likes - a.likes)
                      .map((item) => (
                        <div key={item.entityId}>
                          <div
                            className="flex flex-col md:flex-row w-full justify-between items-start md:items-center p-4 md:p-6 
                border rounded-md hover:bg-[#6d28d9] hover:scale-[1.02] transition-transform 
                cursor-pointer duration-300 ease-in"
                            onClick={() => (window.location.href = item.url)}
                          >
                            {/* Left side content */}
                            <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
                              <div className="flex items-center gap-3 text-sm md:text-base text-[#c1c3c8]">
                                <Album className="flex-shrink-0" />
                                <span className="break-words">
                                  {item.description}
                                </span>
                              </div>
                            </div>

                            {/* Right side content */}
                            <div className="flex flex-row justify-between md:justify-end items-center w-full md:w-auto mt-3 md:mt-0 gap-4 text-[#c1c3c8] text-sm md:text-base">
                              <div className="flex items-center gap-3">
                                <User2 className="flex-shrink-0" />
                                <span>{item.uploadedBy}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span>{item.likes}</span>
                                <Heart
                                  onClick={(e) =>
                                    handleLikeClicked(
                                      e,
                                      item.entityId,
                                      item.likes
                                    )
                                  }
                                  fill={
                                    isEntityLikedByUser(
                                      item.entityId,
                                      userLikedEntity
                                    )
                                      ? "#c1c3c8"
                                      : "none"
                                  }
                                  className="transition-colors duration-300"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 text-red-900 font-bold text-xl">
                    No Data Found
                  </div>
                )}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Flex>

      <Modals
        entity={entity}
        isModalOpen={isModalOpen}
        setRefresh={setRefresh}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}
