import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Text,
  Flex,
  Badge,
  Card,
  Avatar,
  Grid,
  Button,
} from "@chakra-ui/react";
import {
  MdCalendarToday,
  MdStar,
  MdAccessTime,
  MdLocalHospital,
  MdHistory,
} from "react-icons/md";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import SearchInput from "@/components/common/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import * as appointmentSlice from "@/features/appointments/appointmentSlice";
import * as appointmentSelectors from "@/features/appointments/appointmentSelectors";

const STATUS_COLOR = {
  confirmed: "green",
  pending: "orange",
  completed: "teal",
  cancelled: "red",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AppointmentHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointments = useSelector(appointmentSelectors.selectAppointments);
  const pagination = useSelector(appointmentSelectors.selectAppointmentsPagination);
  const loading = useSelector(appointmentSelectors.selectAppointmentsLoading);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      appointmentSlice.fetchAppointmentsRequest({
        page,
        limit: 10,
        status: "completed,cancelled",
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  if (loading) return <Loader />;

  // Group by month-year (data already filtered server-side)
  const grouped = appointments.reduce((acc, a) => {
    const date = new Date(a.appointmentDate || a.date);
    const key = `${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <Stack gap={6}>
      <PageHeader
        title="Appointment History"
        subtitle={`${pagination?.total || appointments.length} past appointment${(pagination?.total || appointments.length) !== 1 ? "s" : ""}`}
        backTo="/patient/appointments"
        backLabel="Appointments"
      />

      {(appointments.length > 0 || search) && (
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by doctor, hospital, or specialty…"
          maxW="400px"
        />
      )}

      {appointments.length === 0 && !search ? (
        <EmptyState
          icon={<MdHistory size={36} />}
          title="No appointment history"
          description="Your completed and cancelled appointments will appear here."
        />
      ) : appointments.length === 0 ? (
        <EmptyState
          search={search}
          actionLabel="Clear Search"
          onAction={() => setSearch("")}
          withCard={false}
        />
      ) : (
        <Stack gap={6}>
          {Object.entries(grouped).map(([monthYear, items]) => (
            <Box key={monthYear}>
              <Text
                fontWeight="700"
                color="gray.600"
                fontSize="sm"
                mb={3}
                textTransform="uppercase"
                letterSpacing="wider"
              >
                {monthYear}
              </Text>
              <Stack gap={3}>
                {items.map((a) => {
                  const doctorName = a.doctorId?.name || "Doctor";
                  const hospitalName = a.hospitalId?.name || "";
                  const specialty = a.doctorId?.specialtyId?.name || "General";

                  return (
                    <Card.Root
                      key={a._id}
                      shadow="sm"
                      rounded="xl"
                      borderLeft="4px solid"
                      borderColor={`${STATUS_COLOR[a.status] || "gray"}.400`}
                      _hover={{ shadow: "md" }}
                      transition="all 0.2s"
                    >
                      <Card.Body py={4} px={5}>
                        <Flex
                          justify="space-between"
                          align="center"
                          wrap="wrap"
                          gap={3}
                        >
                          <Flex align="center" gap={3}>
                            <Avatar.Root size="md" bg="teal.500" flexShrink={0}>
                              <Avatar.Fallback name={doctorName} />
                            </Avatar.Root>
                            <Box>
                              <Text fontWeight="700" fontSize="sm">
                                {doctorName}
                              </Text>
                              <Badge
                                colorPalette="teal"
                                size="sm"
                                variant="outline"
                              >
                                {specialty}
                              </Badge>
                              {hospitalName && (
                                <Flex align="center" gap={1} mt={1}>
                                  <MdLocalHospital size={12} color="#718096" />
                                  <Text fontSize="xs" color="gray.500">
                                    {hospitalName}
                                  </Text>
                                </Flex>
                              )}
                            </Box>
                          </Flex>

                          <Flex direction="column" align="flex-end" gap={1}>
                            <Badge
                              colorPalette={STATUS_COLOR[a.status] || "gray"}
                              textTransform="capitalize"
                            >
                              {a.status}
                            </Badge>
                            <Flex align="center" gap={1}>
                              <MdCalendarToday size={12} color="#718096" />
                              <Text fontSize="xs" color="gray.500">
                                {formatDate(a.appointmentDate || a.date)}
                              </Text>
                            </Flex>
                            <Flex align="center" gap={1}>
                              <MdAccessTime size={12} color="#718096" />
                              <Text fontSize="xs" color="gray.500">
                                {a.timeSlot || a.time}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>

                        {a.status === "completed" && (
                          <Flex justify="flex-end" mt={3}>
                            <Box
                              as="button"
                              fontSize="xs"
                              fontWeight="600"
                              color="orange.500"
                              cursor="pointer"
                              _hover={{ color: "orange.600" }}
                              onClick={() =>
                                navigate(`/patient/review/${a._id}`)
                              }
                              display="flex"
                              alignItems="center"
                              gap={1}
                            >
                              <MdStar size={14} /> Rate Doctor
                            </Box>
                          </Flex>
                        )}
                      </Card.Body>
                    </Card.Root>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Flex justify="center" gap={2} mt={2}>
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <Flex align="center" gap={1}>
            <Text fontSize="sm" color="gray.600">
              Page {page} of {pagination.totalPages}
            </Text>
          </Flex>
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Flex>
      )}
    </Stack>
  );
}
