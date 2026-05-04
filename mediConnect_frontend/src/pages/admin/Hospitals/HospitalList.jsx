import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Button,
  Flex,
  Input,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { MdLocalHospital, MdAdd, MdSearch, MdClose } from "react-icons/md";
import * as hospitalSlice from "@/features/hospitals/hospitalSlice";
import * as hospitalSelectors from "@/features/hospitals/hospitalSelectors";
import DataTable from "@/components/common/DataTable";
import StatCard from "./componets/StatCard";
import useHospitalColumns from "./componets/useHospitalColumns";
import EmptyState from "@/components/common/EmptyState";
import ConfirmToggleDialog from "./componets/ConfirmToggleDialog";
import { STATS } from "./componets/constants";
import useDebounce from "@/hooks/useDebounce";

export default function HospitalList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hospitals = useSelector(hospitalSelectors.selectHospitals);
  const pagination = useSelector(hospitalSelectors.selectHospitalsPagination);
  const loading = useSelector(hospitalSelectors.selectHospitalsLoading);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [confirmToggle, setConfirmToggle] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      hospitalSlice.fetchHospitalsRequest({
        page,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    );
  }, [dispatch, page, pageSize, debouncedSearch]);

  if (loading) {
    return (
      <Center py={16}>
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  const activeCount = pagination?.total
    ? hospitals.filter((h) => h.status === "active").length
    : 0;
  const statValues = {
    total: pagination?.total || hospitals.length,
    active: activeCount,
    inactive: (pagination?.total || hospitals.length) - activeCount,
  };

  const handleToggle = (id) => {
    dispatch(hospitalSlice.toggleHospitalStatusRequest(id));
    setConfirmToggle(null);
  };

  const columns = useHospitalColumns(
    (id) => navigate(`/admin/hospitals/${id}`),
    (id) => navigate(`/admin/hospitals/edit/${id}`),
    (h) => setConfirmToggle(h),
  );

  return (
    <Stack gap={6}>
      {/* ── Page header ── */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Flex align="center" gap={3}>
          <Flex
            align="center"
            justify="center"
            color="teal.500"
            bg="teal.50"
            p={2.5}
            rounded="xl"
          >
            <MdLocalHospital size={22} />
          </Flex>
          <Box>
            <Heading size="lg">Hospital Management</Heading>
            <Text color="gray.500" fontSize="sm">
              Manage all registered healthcare facilities
            </Text>
          </Box>
        </Flex>
        <Button
          colorPalette="teal"
          onClick={() => navigate("/admin/hospitals/new")}
        >
          <MdAdd /> Add Hospital
        </Button>
      </Flex>

      {/* ── Summary stats ── */}
      <Flex gap={3} wrap="wrap">
        {STATS.map((s) => (
          <StatCard
            key={s.key}
            label={s.label}
            value={statValues[s.key]}
            color={s.color}
            icon={s.icon}
          />
        ))}
      </Flex>

      {/* ── Search bar ── */}
      <Flex align="center" gap={3} wrap="wrap">
        <Box position="relative" maxW="400px" flex="1">
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
            zIndex={1}
          >
            <MdSearch size={18} />
          </Box>
          <Input
            pl={9}
            pr={search ? 8 : 3}
            placeholder="Search by name or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <Box
              position="absolute"
              right={3}
              top="50%"
              transform="translateY(-50%)"
              color="gray.400"
              cursor="pointer"
              onClick={() => setSearch("")}
              zIndex={1}
              _hover={{ color: "gray.600" }}
            >
              <MdClose size={16} />
            </Box>
          )}
        </Box>

        {search && (
          <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
            {pagination?.total || hospitals.length} result
            {(pagination?.total || hospitals.length) !== 1 ? "s" : ""} for
            &ldquo;{search}&rdquo;
          </Text>
        )}
      </Flex>

      {/* ── Hospital table ── */}
      {hospitals.length > 0 ? (
        <DataTable
          columns={columns}
          data={hospitals}
          rowKey="_id"
          pageSize={pageSize}
          sortable
          hoverable
          colorPalette="teal"
          emptyText="No hospitals found"
          emptyIcon={<MdLocalHospital size={40} />}
          serverTotal={pagination?.total || 0}
          serverPage={page}
          onPageChange={(p, size) => {
            setPage(p);
            setPageSize(size);
          }}
        />
      ) : (
        <EmptyState
          icon={<MdLocalHospital size={32} />}
          search={search}
          title="No hospitals found"
          description="Get started by registering your first healthcare facility."
          actionLabel="Add Hospital"
          actionIcon={<MdAdd />}
          onAction={() => navigate("/admin/hospitals/new")}
        />
      )}

      {/* ── Dialogs ── */}
      <ConfirmToggleDialog
        hospital={confirmToggle}
        onConfirm={handleToggle}
        onCancel={() => setConfirmToggle(null)}
      />
    </Stack>
  );
}
