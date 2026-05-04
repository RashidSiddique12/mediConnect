import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Text,
  Flex,
  Button,
  Card,
  Grid,
  Badge,
  Input,
  Field,
} from "@chakra-ui/react";
import {
  MdSchedule,
  MdPerson,
  MdArrowForward,
  MdCalendarToday,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import {
  selectDoctors,
  selectDoctorsLoading,
} from "@/features/doctors/doctorSelectors";
import { selectSchedules } from "@/features/schedules/scheduleSelectors";
import * as doctorSlice from "@/features/doctors/doctorSlice";
import * as scheduleSlice from "@/features/schedules/scheduleSlice";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function toDateKey(dateStr) {
  return new Date(dateStr).toISOString().split("T")[0];
}

export default function ScheduleList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctors = useSelector(selectDoctors);
  const loading = useSelector(selectDoctorsLoading);
  const allSchedules = useSelector(selectSchedules);

  const today = new Date().toISOString().split("T")[0];
  const [dateRange, setDateRange] = useState({
    from: today,
    to: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  });

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorsRequest({ myHospital: true }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      scheduleSlice.fetchSchedulesRequest({
        from: dateRange.from,
        to: dateRange.to,
      }),
    );
  }, [dispatch, dateRange.from, dateRange.to]);

  const doctorScheduleMap = useMemo(() => {
    const map = new Map();
    for (const s of allSchedules) {
      const dId = s.doctorId?._id || s.doctorId;
      if (!map.has(dId)) map.set(dId, []);
      map.get(dId).push(s);
    }
    // Sort each doctor's schedules by date
    for (const [, arr] of map) {
      arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return map;
  }, [allSchedules]);

  if (loading) return <Loader />;

  return (
    <Stack gap={6}>
      <PageHeader
        title="Doctor Schedules"
        subtitle="Manage doctor availability by specific dates"
      />

      {/* Date Range Filter */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex
            gap={4}
            align="flex-end"
            direction={{ base: "column", sm: "row" }}
          >
            <Field.Root>
              <Field.Label fontSize="sm">From</Field.Label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((p) => ({ ...p, from: e.target.value }))
                }
              />
            </Field.Root>
            <Field.Root>
              <Field.Label fontSize="sm">To</Field.Label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((p) => ({ ...p, to: e.target.value }))
                }
              />
            </Field.Root>
          </Flex>
        </Card.Body>
      </Card.Root>

      {doctors.length === 0 ? (
        <EmptyState
          title="No doctors yet"
          description="Add doctors first to manage their schedules"
          icon={<MdPerson size={36} />}
          actionLabel="Add Doctor"
          onAction={() => navigate("/hospital/doctors/add")}
        />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(340px, 1fr))" gap={4}>
          {doctors.map((d) => {
            const schedules = doctorScheduleMap.get(d._id) || [];
            const upcoming = schedules.filter(
              (s) => toDateKey(s.date) >= today,
            );
            const past = schedules.length - upcoming.length;
            return (
              <Card.Root
                key={d._id}
                shadow="sm"
                rounded="xl"
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Card.Body>
                  <Flex justify="space-between" align="flex-start" mb={3}>
                    <Flex align="center" gap={2}>
                      <Box color="teal.500">
                        <MdPerson size={22} />
                      </Box>
                      <Box>
                        <Text fontWeight="700">{d.name}</Text>
                        <Badge colorPalette="teal" size="sm">
                          {d.specialtyIds?.[0]?.name || "General"}
                        </Badge>
                      </Box>
                    </Flex>
                    <Flex gap={1}>
                      {upcoming.length > 0 && (
                        <Badge colorPalette="green" size="sm">
                          {upcoming.length} upcoming
                        </Badge>
                      )}
                      {past > 0 && (
                        <Badge colorPalette="gray" size="sm">
                          {past} past
                        </Badge>
                      )}
                      {schedules.length === 0 && (
                        <Badge colorPalette="gray" size="sm">
                          No schedules
                        </Badge>
                      )}
                    </Flex>
                  </Flex>

                  {upcoming.length > 0 ? (
                    <Stack gap={2} mb={3}>
                      {upcoming.slice(0, 4).map((s) => (
                        <Flex
                          key={s._id}
                          align="center"
                          gap={2}
                          bg="teal.50"
                          px={3}
                          py={2}
                          rounded="md"
                        >
                          <MdCalendarToday color="#0b9c9c" size={14} />
                          <Text fontSize="xs" fontWeight="600" color="teal.700">
                            {formatDate(s.date)}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {s.startTime} – {s.endTime}
                          </Text>
                          <Badge colorPalette="teal" size="sm" ml="auto">
                            {s.slotDuration}min
                          </Badge>
                        </Flex>
                      ))}
                      {upcoming.length > 4 && (
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          +{upcoming.length - 4} more dates
                        </Text>
                      )}
                    </Stack>
                  ) : (
                    <Box bg="orange.50" p={3} rounded="md" mb={3}>
                      <Text fontSize="xs" color="orange.600">
                        No upcoming schedules configured
                      </Text>
                    </Box>
                  )}

                  <Button
                    size="sm"
                    w="full"
                    colorPalette="teal"
                    variant={upcoming.length > 0 ? "outline" : "solid"}
                    onClick={() =>
                      navigate(`/hospital/schedules/slots/${d._id}`)
                    }
                  >
                    {upcoming.length > 0 ? "Manage Dates" : "Create Schedule"}
                    <MdArrowForward />
                  </Button>
                </Card.Body>
              </Card.Root>
            );
          })}
        </Grid>
      )}
    </Stack>
  );
}
