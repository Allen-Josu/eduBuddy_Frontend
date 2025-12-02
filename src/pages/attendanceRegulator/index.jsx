import { useEffect, useState, useCallback, useMemo } from "react";
import Header from "../../components/Header";
import axios from "axios";
import AttendanceModal from "../../components/modals/attendance";
import { useUserStore } from "../../store/userStore";
import dayjs from "dayjs";
import Calendar from "../../components/ui/calender";

const BASE_URL = import.meta.env.VITE_URL;
const START_DATE = dayjs(import.meta.env.VITE_START_DATE); // Fallback to a default date if not set
const HOURS_PER_DAY = 6;

// Utility functions
const countWeekends = (start, end) => {
  let count = 0;
  for (
    let date = start;
    date.isBefore(end) || date.isSame(end, "day");
    date = date.add(1, "day")
  ) {
    const dayOfWeek = date.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) count++;
  }
  return count;
};

const isWeekend = (date) => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const isFutureDate = (date) => date > new Date();

// Custom hook for attendance data
const useAttendanceData = (email, refreshTrigger) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!email) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/attendance?entityType=all&email=${email}`
        );
        setData(response.data.results);
        setError(null);
      } catch (err) {
        setError(err);
        console.error("Error fetching attendance data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [email, refreshTrigger]);

  return { data, error, isLoading };
};

// Custom hook for attendance calculations
const useAttendanceCalculations = (attendanceData) => {
  return useMemo(() => {
    if (!attendanceData) return null;

    console.log("====================================");
    console.log(attendanceData);
    console.log("====================================");

    const currentDate = dayjs();
    let totalDays = currentDate.diff(START_DATE, "day") + 1;

    // Subtract weekends from total days
    const weekendCount = countWeekends(START_DATE, currentDate);
    totalDays -= weekendCount;

    const leaveStats = attendanceData.reduce(
      (acc, item) => {
        if (item.leaveDate && dayjs(item.leaveDate).isAfter(START_DATE)) {
          if (Array.isArray(item.leavePerDay)) {
            item.leavePerDay.forEach((leave) => {
              switch (leave.reason) {
                case "No Class":
                  acc.noClass++;
                  break;
                case "Duty Leave":
                  acc.dutyLeave++;
                  break;
                default:
                  acc.otherLeave++;
                  break;
              }
            });
          }
        }
        return acc;
      },
      { noClass: 0, dutyLeave: 0, otherLeave: 0 }
    );

    const totalHours = totalDays * HOURS_PER_DAY - leaveStats.noClass;
    const attendanceWithDuty = totalHours - leaveStats.otherLeave;
    const attendanceWithoutDuty =
      totalHours - (leaveStats.otherLeave + leaveStats.dutyLeave);

    return {
      totalPercent: ((attendanceWithDuty / totalHours) * 100).toFixed(2),
      totalPercentExcludeDuty: (
        (attendanceWithoutDuty / totalHours) *
        100
      ).toFixed(2),
      totalHours,
    };
  }, [attendanceData]);
};

// Custom hook for marked dates
const useMarkedDates = (attendanceData) => {
  return useMemo(() => {
    if (!attendanceData) return [];

    return attendanceData
      .filter((data) => data.leavePerDay && data.leavePerDay.length > 0)
      .map((data) => {
        const date = dayjs(data.leaveDate);
        return date.isValid() ? date.format("YYYY-MM-DD") : null;
      })
      .filter(Boolean);
  }, [attendanceData]);
};

// Main component
const AttendanceRegulator = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const user = useUserStore((state) => state.user);
  const {
    data: attendanceData,
    error,
    isLoading,
  } = useAttendanceData(user?.email, refreshTrigger);
  const attendanceStats = useAttendanceCalculations(attendanceData);
  const markedDates = useMarkedDates(attendanceData);

  const handleDateSelect = useCallback((date) => {
    if (isWeekend(date)) {
      alert("Attendance cannot be marked on holidays");
      return;
    }

    if (isFutureDate(date)) {
      alert("You cannot mark attendance for a future date.");
      return;
    }

    setSelectedDate(date);
    setShowModal(true);
  }, []);

  const handleOperationSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setShowModal(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div className="bg-[#27272a] min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p>Unable to load attendance data. Please try again later.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#27272a] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#c1c3c8] mb-4 sm:mb-6 lg:mb-8">
            📅 Attendance Regulator
          </h1>

          <div className="flex flex-col lg:flex-row-reverse gap-4 sm:gap-6 lg:gap-8">
            {/* Calendar Section */}
            <div className="w-full lg:w-1/3">
              <Calendar
                onDateSelect={handleDateSelect}
                markedDates={markedDates}
                startDate={START_DATE}
              />
            </div>

            {/* Statistics Section */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                    <p className="text-gray-600 mt-4">
                      Loading attendance data...
                    </p>
                  </div>
                ) : attendanceStats ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
                            Metric
                          </th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                            Total Hours
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                            {attendanceStats.totalHours} hrs
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                            Attendance (with duty leave)
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                            <span
                              className={`font-semibold ${
                                parseFloat(attendanceStats.totalPercent) >= 75
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {attendanceStats.totalPercent}%
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                            Attendance (without duty leave)
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                            <span
                              className={`font-semibold ${
                                parseFloat(
                                  attendanceStats.totalPercentExcludeDuty
                                ) >= 75
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {attendanceStats.totalPercentExcludeDuty}%
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No attendance data available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal */}
          <AttendanceModal
            showModal={showModal}
            setShowModal={handleCloseModal}
            selectedDate={selectedDate}
            onSuccess={handleOperationSuccess}
          />
        </div>
      </div>
    </>
  );
};

export default AttendanceRegulator;
