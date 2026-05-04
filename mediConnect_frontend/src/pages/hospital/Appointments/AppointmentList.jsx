import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Text,
  Flex,
  Badge,
  Button,
  Avatar,
  Card,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import {
  MdEventNote,
  MdArrowForward,
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdRefresh,
  MdAccessTime,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import SearchInput from "@/components/common/SearchInput";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import useDebounce from "@/hooks/useDebounce";
import * as appointmentSlice from "@/features/appointments/appointmentSlice";
import {
  selectAppointments,
  selectAppointmentsPagination,
  selectAppointmentsLoading,
} from "@/features/appointments/appointmentSelectors";

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: "All Status", value: "" },
    { label: "Booked", value: "booked" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ],
});

const STATUS_COLOR = { booked: "green", completed: "teal", cancelled: "red" };
const STATUS_ICON = {
  booked: MdAccessTime,
  completed: MdCheckCircle,
  cancelled: MdCancel,
};

const SUMMARY_ITEMS = [
  { label: "Total", key: "total", color: "gray", icon: MdEventNote },
  { label: "Booked", key: "booked", color: "green", icon: MdAccessTime },
  { label: "Completed", key: "completed", color: "teal", icon: MdCheckCircle },
  { label: "Cancelled", key: "cancelled", color: "red", icon: MdCancel },
];

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AppointmentList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointments = useSelector(selectAppointments);
  const pagination = useSelector(selectAppointmentsPagination);
  const loading = useSelector(selectAppointmentsLoading);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    dispatch(
      appointmentSlice.fetchAppointmentsRequest({
        page,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter && { status: statusFilter }),
      }),
    );
  }, [dispatch, page, pageSize, debouncedSearch, statusFilter]);

  const counts = useMemo(
    () => ({
      total: pagination?.total || appointments.length,
      booked: appointments.filter((a) => a.status === "booked").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
    }),
    [appointments, pagination],
  );

  const handleUpdateStatus = (e, id, status) => {
    e.stopPropagation();
    dispatch(appointmentSlice.updateAppointmentRequest({ id, status }));
  };

  const handleCancel = (e, id) => {
    e.stopPropagation();
    dispatch(appointmentSlice.cancelAppointmentRequest(id));
  };

  const handleRefresh = () =>
    dispatch(
      appointmentSlice.fetchAppointmentsRequest({
        page,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter && { status: statusFilter }),
      }),
    );

  const columns = useMemo(
    () => [
      {
        key: "patient",
        header: "Patient",
        accessor: (row) => row.patientId?.name || "",
        render: (_val, row) => (
          <Flex align="center" gap={3}>
            <Avatar.Root size="sm" bg="blue.500" flexShrink={0}>
              <Avatar.Fallback name={row.patientId?.name || "P"} />
            </Avatar.Root>
            <Box>
              <Text fontWeight="600" fontSize="sm" lineClamp={1}>
                {row.patientId?.name || "N/A"}
              </Text>
              <Text fontSize="xs" color="gray.500" lineClamp={1}>
                {row.patientId?.email || ""}
              </Text>
            </Box>
          </Flex>
        ),
      },
      {
        key: "doctor",
        header: "Doctor",
        accessor: (row) => row.doctorId?.name || "",
        render: (_val, row) => (
          <Flex align="center" gap={3}>
            <Avatar.Root size="sm" bg="teal.500" flexShrink={0}>
              <Avatar.Fallback name={row.doctorId?.name || "D"} />
            </Avatar.Root>
            <Text fontWeight="500" fontSize="sm" lineClamp={1}>
              {row.doctorId?.name || "N/A"}
            </Text>
          </Flex>
        ),
      },
      {
        key: "appointmentDate",
        header: "Date & Time",
        sortable: true,
        render: (_val, row) => (
          <Flex align="center" gap={2}>
            <Box color="gray.400" flexShrink={0}>
              <MdCalendarToday size={14} />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="500">
                {formatDate(row.appointmentDate)}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {row.timeSlot}
              </Text>
            </Box>
          </Flex>
        ),
      },
      {
        key: "reason",
        header: "Reason",
        render: (_val, row) => (
          <Text fontSize="sm" color="gray.600" lineClamp={1} maxW="160px">
            {row.reason || "—"}
          </Text>
        ),
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        render: (_val, row) => {
          const Icon = STATUS_ICON[row.status];
          return (
            <Badge
              colorPalette={STATUS_COLOR[row.status] || "gray"}
              size="sm"
              variant="subtle"
              px={2}
              py={0.5}
              rounded="full"
            >
              <Flex align="center" gap={1}>
                {Icon && <Icon size={12} />}
                {row.status}
              </Flex>
            </Badge>
          );
        },
      },
      {
        key: "actions",
        header: "Actions",
        sortable: false,
        render: (_val, row) => (
          <Flex gap={1} wrap="wrap">
            {row.status === "booked" && (
              <>
                <Button
                  size="xs"
                  colorPalette="teal"
                  variant="subtle"
                  onClick={(e) => handleUpdateStatus(e, row._id, "completed")}
                >
                  <MdCheckCircle /> Complete
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  colorPalette="red"
                  onClick={(e) => handleCancel(e, row._id)}
                >
                  <MdCancel />
                </Button>
              </>
            )}
            <Button
              size="xs"
              variant="ghost"
              colorPalette="teal"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/hospital/appointments/${row._id}`);
              }}
            >
              <MdArrowForward /> View
            </Button>
          </Flex>
        ),
      },
    ],
    [navigate],
  );

  if (loading) return <Loader />;

  return (
    <Stack gap={6}>
      <PageHeader
        title="Appointments"
        subtitle="Manage all hospital appointments"
        actions={[
          <Button
            key="refresh"
            size="sm"
            variant="outline"
            colorPalette="teal"
            onClick={handleRefresh}
          >
            <MdRefresh /> Refresh
          </Button>,
        ]}
      />

      {/* ─── Summary Cards ─── */}
      <Flex gap={3} wrap="wrap">
        {SUMMARY_ITEMS.map(({ label, key, color, icon: Icon }) => {
          // const isActive =
          //   statusFilter === key || (key === "total" && !statusFilter);
          return (
            <Card.Root
              key={key}
              flex="1"
              minW="140px"
              cursor="pointer"
              // onClick={() => setStatusFilter(key === "total" ? "" : key)}
              shadow={"sm"}
              borderWidth="1px"
              borderColor={"gray.100"}
              borderBottomWidth="3px"
              borderBottomColor={"transparent"}
              bg={"white"}
              _hover={{ shadow: "md", borderColor: `${color}.300` }}
              transition="all 0.2s"
            >
              <Card.Body py={3} px={4}>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text
                      fontSize="xs"
                      color={`${color}.600`}
                      fontWeight="600"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      {label}
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="800"
                      color={`${color}.700`}
                      mt={0.5}
                    >
                      {counts[key]}
                    </Text>
                  </Box>
                  <Box
                    bg={`${color}.100`}
                    p={2}
                    rounded="lg"
                    color={`${color}.500`}
                  >
                    <Icon size={22} />
                  </Box>
                </Flex>
              </Card.Body>
            </Card.Root>
          );
        })}
      </Flex>

      {/* ─── Filters ─── */}
      <Card.Root shadow="sm">
        <Card.Body py={3}>
          <Flex gap={3} wrap="wrap" align="center">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search patient or doctor…"
              flex="1"
              minW="200px"
              maxW="none"
            />
            <Select.Root
              collection={STATUS_OPTIONS}
              w="180px"
              size="sm"
              onValueChange={(v) => setStatusFilter(v.value[0] || "")}
            >
              <Select.Trigger>
                <Select.ValueText placeholder="Filter status" />
              </Select.Trigger>
              <Select.Content>
                {STATUS_OPTIONS.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* ─── Table ─── */}
      {appointments.length === 0 ? (
        <EmptyState
          search={search || statusFilter}
          title="No appointments yet"
          description="Appointments will appear here once patients start booking"
          icon={<MdEventNote size={36} />}
        />
      ) : (
        <DataTable
          columns={columns}
          data={appointments}
          pageSize={pageSize}
          sortable
          hoverable
          onRowClick={(row) => navigate(`/hospital/appointments/${row._id}`)}
          emptyText="No appointments match your filters"
          emptyIcon={<MdEventNote size={28} />}
          serverTotal={pagination?.total || 0}
          serverPage={page}
          onPageChange={(p, size) => {
            setPage(p);
            setPageSize(size);
          }}
        />
      )}
    </Stack>
  );
}
