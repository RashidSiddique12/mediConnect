import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Badge,
  Button,
  Card,
  Avatar,
  Grid,
} from "@chakra-ui/react";
import {
  MdCalendarToday,
  MdCancel,
  MdStar,
  MdArrowForward,
  MdSearch,
  MdAccessTime,
  MdLocalHospital,
  MdHistory,
} from "react-icons/md";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import * as appointmentSlice from "@/features/appointments/appointmentSlice";
import * as appointmentSelectors from "@/features/appointments/appointmentSelectors";

const STATUS_COLOR = {
  confirmed: "green",
  pending: "orange",
  completed: "teal",
  cancelled: "red",
  booked: "green",
};

const FILTER_TO_STATUS = {
  "": undefined,
  upcoming: "confirmed,pending,booked",
  completed: "completed",
  cancelled: "cancelled",
};

const FILTERS = [
  { key: "", label: "All", color: "gray" },
  { key: "upcoming", label: "Upcoming", color: "orange" },
  { key: "completed", label: "Completed", color: "teal" },
  { key: "cancelled", label: "Cancelled", color: "red" },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyAppointments() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointments = useSelector(appointmentSelectors.selectAppointments);
  const pagination = useSelector(appointmentSelectors.selectAppointmentsPagination);
  const loading = useSelector(appointmentSelectors.selectAppointmentsLoading);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    dispatch(
      appointmentSlice.fetchAppointmentsRequest({
        page,
        limit: 10,
        ...(FILTER_TO_STATUS[filter] && { status: FILTER_TO_STATUS[filter] }),
      }),
    );
  }, [dispatch, filter, page]);

  if (loading) return <Loader />;

  const handleCancel = (id) => {
    setCancellingId(id);
    dispatch(appointmentSlice.cancelAppointmentRequest(id));
    setTimeout(() => setCancellingId(null), 2000);
  };

  const counts = {
    all: pagination?.total || appointments.length,
    upcoming: appointments.filter((a) =>
      ["confirmed", "pending", "booked"].includes(a.status),
    ).length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  return (
    <Stack gap={6}>
      <PageHeader
        title="My Appointments"
        subtitle="Track all your medical visits"
        actions={[
          <Button
            key="history"
            size="sm"
            variant="outline"
            colorPalette="teal"
            onClick={() => navigate("/patient/appointments/history")}
          >
            <MdHistory /> History
          </Button>,
        ]}
      />

      {/* Summary filter tabs */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={3}
      >
        {FILTERS.map(({ key, label, color }) => {
          const count = key === "" ? counts.all : counts[key];
          const isActive = filter === key;
          return (
            <Box
              key={label}
              bg={isActive ? `${color}.50` : "white"}
              border="2px solid"
              borderColor={isActive ? `${color}.400` : "gray.200"}
              px={4}
              py={3}
              rounded="xl"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{ borderColor: `${color}.300`, shadow: "sm" }}
              onClick={() => setFilter(key)}
            >
              <Text fontSize="xs" color={`${color}.600`} fontWeight="500">
                {label}
              </Text>
              <Text fontSize="2xl" fontWeight="700" color={`${color}.600`}>
                {count}
              </Text>
            </Box>
          );
        })}
      </Grid>

      {/* Appointment list */}
      <Stack gap={4}>
        {appointments.map((a) => {
          const doctorName = a.doctorId?.name || "Doctor";
          const hospitalName =
            a.hospitalId?.name || a.doctorId?.hospitalId?.name || "";
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
              <Card.Body p={{ base: 4, md: 5 }}>
                <Flex
                  justify="space-between"
                  align="flex-start"
                  wrap="wrap"
                  gap={3}
                >
                  {/* Doctor info */}
                  <Flex align="center" gap={3} flex={1} minW="200px">
                    <Avatar.Root size="md" bg="teal.500" flexShrink={0}>
                      <Avatar.Fallback name={doctorName} />
                    </Avatar.Root>
                    <Box>
                      <Text fontWeight="700">{doctorName}</Text>
                      <Badge
                        colorPalette="teal"
                        size="sm"
                        variant="outline"
                        mt={0.5}
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

                  {/* Date & status */}
                  <Flex
                    direction="column"
                    align={{ base: "flex-start", md: "flex-end" }}
                    gap={1}
                  >
                    <Badge
                      colorPalette={STATUS_COLOR[a.status] || "gray"}
                      size="md"
                      textTransform="capitalize"
                    >
                      {a.status}
                    </Badge>
                    <Flex align="center" gap={1.5}>
                      <MdCalendarToday size={13} color="#718096" />
                      <Text fontSize="sm" fontWeight="600" color="gray.700">
                        {formatDate(a.appointmentDate || a.date)}
                      </Text>
                    </Flex>
                    <Flex align="center" gap={1.5}>
                      <MdAccessTime size={13} color="#718096" />
                      <Text fontSize="sm" color="gray.500">
                        {a.timeSlot || a.time}
                      </Text>
                    </Flex>
                    {a.fee > 0 && (
                      <Text fontWeight="700" color="teal.600" fontSize="sm">
                        ${a.fee}
                      </Text>
                    )}
                  </Flex>
                </Flex>

                {/* Notes */}
                {a.notes && (
                  <Box bg="gray.50" rounded="lg" px={3} py={2} mt={3}>
                    <Text fontSize="xs" color="gray.500">
                      <Text as="span" fontWeight="600">
                        Notes:
                      </Text>{" "}
                      {a.notes}
                    </Text>
                  </Box>
                )}

                {/* Actions */}
                <Flex gap={2} mt={4} justify="flex-end" wrap="wrap">
                  {a.status === "completed" && (
                    <Button
                      size="sm"
                      colorPalette="orange"
                      variant="outline"
                      onClick={() => navigate(`/patient/review/${a._id}`)}
                    >
                      <MdStar /> Rate Doctor
                    </Button>
                  )}
                  {(a.status === "confirmed" || a.status === "pending") && (
                    <Button
                      size="sm"
                      variant="outline"
                      colorPalette="red"
                      onClick={() => handleCancel(a._id)}
                      disabled={cancellingId === a._id}
                    >
                      <MdCancel />{" "}
                      {cancellingId === a._id ? "Cancelling…" : "Cancel"}
                    </Button>
                  )}
                  {a.status === "pending" && (
                    <Button
                      size="sm"
                      colorPalette="teal"
                      onClick={() =>
                        navigate(`/patient/book/${a.doctorId?._id}`)
                      }
                    >
                      Reschedule <MdArrowForward />
                    </Button>
                  )}
                </Flex>
              </Card.Body>
            </Card.Root>
          );
        })}
      </Stack>

      {appointments.length === 0 && (
        <EmptyState
          icon={<MdCalendarToday size={36} />}
          title={filter ? `No ${filter} appointments` : "No appointments yet"}
          description={
            filter
              ? "Try selecting a different filter."
              : "Find a doctor and book your first appointment."
          }
          actionLabel={!filter ? "Find a Doctor" : undefined}
          actionIcon={<MdSearch />}
          onAction={!filter ? () => navigate("/patient/doctors") : undefined}
        />
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
