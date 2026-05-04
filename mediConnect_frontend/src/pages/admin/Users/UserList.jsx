import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Badge,
  Input,
  Avatar,
  Button,
  Select,
  createListCollection,
  Spinner,
  Center,
  Card,
  Grid,
  Portal,
  Dialog,
} from "@chakra-ui/react";
import {
  MdSearch,
  MdPeople,
  MdClose,
  MdPerson,
  MdAdminPanelSettings,
  MdLocalHospital,
  MdVisibility,
  MdBlock,
  MdCheckCircle,
  MdWarning,
  MdToggleOn,
  MdToggleOff,
} from "react-icons/md";
import * as userSlice from "@/features/users/userSlice";
import * as userSelectors from "@/features/users/userSelectors";
import DataTable from "@/components/common/DataTable";
import useDebounce from "@/hooks/useDebounce";

const ROLE_COLOR = {
  super_admin: "red",
  hospital_admin: "purple",
  patient: "teal",
};
const ROLE_LABEL = {
  super_admin: "Super Admin",
  hospital_admin: "Hospital Admin",
  patient: "Patient",
};
const ROLE_ICON = {
  super_admin: MdAdminPanelSettings,
  hospital_admin: MdLocalHospital,
  patient: MdPerson,
};

const roleFilter = createListCollection({
  items: [
    { label: "All Roles", value: "" },
    { label: "Super Admin", value: "super_admin" },
    { label: "Hospital Admin", value: "hospital_admin" },
    { label: "Patient", value: "patient" },
  ],
});

function buildColumns(onNavigate, onToggleStatus) {
  return [
    {
      key: "name",
      header: "User",
      render: (_, u) => (
        <Flex align="center" gap={3}>
          <Avatar.Root size="sm" bg={`${ROLE_COLOR[u.role] || "teal"}.500`}>
            <Avatar.Fallback name={u.name} />
          </Avatar.Root>
          <Box>
            <Text fontWeight="600" fontSize="sm">
              {u.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {u.email}
            </Text>
          </Box>
        </Flex>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (_, u) => {
        const RoleIcon = ROLE_ICON[u.role] || MdPerson;
        return (
          <Badge
            colorPalette={ROLE_COLOR[u.role] || "gray"}
            size="sm"
            display="inline-flex"
            alignItems="center"
            gap={1}
          >
            <RoleIcon size={12} />
            {ROLE_LABEL[u.role] || u.role}
          </Badge>
        );
      },
    },
    {
      key: "details",
      header: "Details",
      sortable: false,
      render: (_, u) => (
        <Text fontSize="xs" color="gray.500">
          {u.hospitalName || u.phone || "—"}
        </Text>
      ),
    },
    {
      key: "joinedDate",
      header: "Joined",
      render: (val) => (
        <Text fontSize="sm" color="gray.600">
          {val}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (val) => (
        <Badge
          colorPalette={val === "active" ? "green" : "red"}
          size="sm"
          display="inline-flex"
          alignItems="center"
          gap={1}
        >
          <Box
            w="6px"
            h="6px"
            rounded="full"
            bg={val === "active" ? "green.400" : "red.400"}
          />
          {val}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      sortable: false,
      render: (_, u) => (
        <Flex gap={1} justify="center">
          <Button
            size="xs"
            variant="ghost"
            colorPalette="teal"
            onClick={() => onNavigate(u._id || u.id)}
            title="View details"
          >
            <MdVisibility />
          </Button>
          {u.role !== "super_admin" && (
            <Button
              size="xs"
              variant="subtle"
              rounded="full"
              colorPalette={u.status === "active" ? "red" : "green"}
              onClick={() => onToggleStatus(u)}
              title={u.status === "active" ? "Deactivate" : "Activate"}
              px={2}
            >
              {u.status === "active" ? (
                <MdToggleOff size={16} />
              ) : (
                <MdToggleOn size={16} />
              )}
            </Button>
          )}
        </Flex>
      ),
    },
  ];
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(userSelectors.selectUsers);
  const pagination = useSelector(userSelectors.selectUsersPagination);
  const loading = useSelector(userSelectors.selectUsersLoading);
  const [search, setSearch] = useState("");
  const [roleVal, setRoleVal] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toggleTarget, setToggleTarget] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleVal]);

  useEffect(() => {
    dispatch(
      userSlice.fetchUsersRequest({
        page,
        limit: pageSize,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(roleVal && { role: roleVal }),
      }),
    );
  }, [dispatch, page, pageSize, debouncedSearch, roleVal]);

  const handleNavigate = (id) => navigate(`/admin/users/${id}`);
  const columns = buildColumns(handleNavigate, setToggleTarget);

  if (loading)
    return (
      <Center py={12}>
        <Spinner size="xl" color="teal.500" />
      </Center>
    );

  const roleCounts = {
    total: pagination?.total || users.length,
    patients: users.filter((u) => u.role === "patient").length,
    hospitalAdmins: users.filter((u) => u.role === "hospital_admin").length,
    superAdmins: users.filter((u) => u.role === "super_admin").length,
  };

  const handleToggleConfirm = () => {
    if (toggleTarget) {
      dispatch(
        userSlice.toggleUserStatusRequest(toggleTarget._id || toggleTarget.id),
      );
      setToggleTarget(null);
    }
  };

  return (
    <Stack gap={6}>
      {/* Gradient Header */}
      <Card.Root
        shadow="sm"
        rounded="xl"
        bg="linear-gradient(135deg, var(--chakra-colors-teal-600) 0%, var(--chakra-colors-teal-800) 100%)"
        color="white"
        overflow="hidden"
        position="relative"
      >
        <Box
          position="absolute"
          right="-20px"
          top="-20px"
          w="120px"
          h="120px"
          bg="whiteAlpha.100"
          rounded="full"
        />
        <Box
          position="absolute"
          right="50px"
          bottom="-25px"
          w="80px"
          h="80px"
          bg="whiteAlpha.50"
          rounded="full"
        />
        <Card.Body py={5}>
          <Flex align="center" gap={3}>
            <Box bg="whiteAlpha.200" p={2.5} rounded="xl">
              <MdPeople size={24} />
            </Box>
            <Box>
              <Heading size="lg" color="white">
                User Management
              </Heading>
              <Text color="teal.200" fontSize="sm" mt={0.5}>
                Monitor and manage all platform accounts
              </Text>
            </Box>
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Summary Cards */}
      <Grid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={4}
      >
        {[
          {
            label: "Total Users",
            value: roleCounts.total,
            color: "teal",
            icon: MdPeople,
          },
          {
            label: "Patients",
            value: roleCounts.patients,
            color: "green",
            icon: MdPerson,
          },
          {
            label: "Hospital Admins",
            value: roleCounts.hospitalAdmins,
            color: "purple",
            icon: MdLocalHospital,
          },
          {
            label: "Super Admins",
            value: roleCounts.superAdmins,
            color: "red",
            icon: MdAdminPanelSettings,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <Card.Root
            key={label}
            shadow="sm"
            rounded="xl"
            _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            <Card.Body py={4} px={5}>
              <Flex align="center" gap={3}>
                <Box
                  color={`${color}.500`}
                  bg={`${color}.50`}
                  p={2.5}
                  rounded="xl"
                >
                  <Icon size={20} />
                </Box>
                <Box>
                  <Text
                    fontSize="2xl"
                    fontWeight="700"
                    color={`${color}.600`}
                    lineHeight="1"
                  >
                    {value}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={0.5}>
                    {label}
                  </Text>
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Filters */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body py={3}>
          <Flex gap={3} wrap="wrap" align="center">
            <Box position="relative" flex="1" minW="220px" maxW="400px">
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
                placeholder="Search by name or email…"
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
            <Select.Root
              collection={roleFilter}
              w="200px"
              onValueChange={(v) => setRoleVal(v.value[0] || "")}
            >
              <Select.Trigger>
                <Select.ValueText placeholder="Filter by role" />
              </Select.Trigger>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {roleFilter.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            {(search || roleVal) && (
              <Button
                size="sm"
                variant="ghost"
                colorPalette="gray"
                onClick={() => {
                  setSearch("");
                  setRoleVal("");
                }}
              >
                Clear filters
              </Button>
            )}
          </Flex>
        </Card.Body>
      </Card.Root>

      {(search || roleVal) && (
        <Text fontSize="sm" color="gray.500">
          Showing {pagination?.total || users.length} of {pagination?.total || users.length} users
        </Text>
      )}

      {/* Table with pagination */}
      <DataTable
        columns={columns}
        data={users}
        rowKey="id"
        pageSize={pageSize}
        sortable
        hoverable
        colorPalette="teal"
        emptyText="No users found"
        emptyIcon={<MdPeople size={40} />}
        serverTotal={pagination?.total || 0}
        serverPage={page}
        onPageChange={(p, size) => {
          setPage(p);
          setPageSize(size);
        }}
      />

      {/* Toggle Status Confirmation Dialog */}
      <Dialog.Root
        open={!!toggleTarget}
        onOpenChange={(e) => {
          if (!e.open) setToggleTarget(null);
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="420px">
            <Dialog.Header>
              <Flex align="center" gap={2}>
                <Box
                  color={
                    toggleTarget?.status === "active" ? "red.500" : "green.500"
                  }
                >
                  <MdWarning size={20} />
                </Box>
                <Dialog.Title>
                  {toggleTarget?.status === "active"
                    ? "Deactivate User"
                    : "Activate User"}
                </Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" color="gray.600">
                Are you sure you want to{" "}
                <Text as="span" fontWeight="700">
                  {toggleTarget?.status === "active"
                    ? "deactivate"
                    : "activate"}
                </Text>{" "}
                <Text as="span" fontWeight="700">
                  {toggleTarget?.name}
                </Text>
                ?
              </Text>
              {toggleTarget?.status === "active" && (
                <Box bg="red.50" p={3} rounded="lg" mt={3}>
                  <Text fontSize="xs" color="red.600" fontWeight="500">
                    This user will lose access to the platform until
                    reactivated.
                  </Text>
                </Box>
              )}
              {toggleTarget?.status !== "active" && toggleTarget && (
                <Box bg="green.50" p={3} rounded="lg" mt={3}>
                  <Text fontSize="xs" color="green.600" fontWeight="500">
                    This user will regain full access to the platform.
                  </Text>
                </Box>
              )}
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setToggleTarget(null)}>
                Cancel
              </Button>
              <Button
                colorPalette={
                  toggleTarget?.status === "active" ? "red" : "green"
                }
                onClick={handleToggleConfirm}
              >
                {toggleTarget?.status === "active" ? (
                  <>
                    <MdToggleOff /> Deactivate
                  </>
                ) : (
                  <>
                    <MdToggleOn /> Activate
                  </>
                )}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  );
}
