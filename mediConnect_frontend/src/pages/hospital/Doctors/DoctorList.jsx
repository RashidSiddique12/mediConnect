import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Text,
  Flex,
  Badge,
  Button,
  Card,
  Grid,
  Avatar,
  Dialog,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdPerson,
  MdPhone,
  MdEmail,
  MdVideoCall,
  MdLanguage,
  MdBadge,
  MdVisibility,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import useDebounce from "@/hooks/useDebounce";
import * as doctorSlice from "@/features/doctors/doctorSlice";
import {
  selectDoctors,
  selectDoctorsLoading,
  selectDoctorsPagination,
} from "@/features/doctors/doctorSelectors";

const CONSULTATION_LABELS = {
  in_person: "In Person",
  video: "Video",
  phone: "Phone",
};

export default function DoctorList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctors = useSelector(selectDoctors);
  const loading = useSelector(selectDoctorsLoading);
  const pagination = useSelector(selectDoctorsPagination);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    dispatch(
      doctorSlice.fetchDoctorsRequest({
        myHospital: true,
        page,
        limit: 12,
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    );
  }, [dispatch, debouncedSearch, page]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = () => {
    dispatch(doctorSlice.deleteDoctorRequest(deleteTarget._id));
    setDeleteTarget(null);
  };

  // Summary stats
  const total = pagination?.total || doctors.length;
  const activeDoctors = doctors.filter((d) => d.status === "active").length;
  const inactiveDoctors = doctors.length - activeDoctors;
  const totalPages = pagination?.totalPages || 1;

  if (loading && doctors.length === 0) return <Loader />;

  return (
    <Stack gap={6}>
      <PageHeader
        title="Doctor Management"
        subtitle={`${total} doctor${total !== 1 ? "s" : ""} in your hospital`}
        actions={[
          <Button
            key="add"
            colorPalette="teal"
            onClick={() => navigate("/hospital/doctors/add")}
          >
            <MdAdd /> Add Doctor
          </Button>,
        ]}
      />

      {/* ─── Quick Stats ─── */}
      {total > 0 && (
        <Grid
          templateColumns={{ base: "1fr 1fr", md: "repeat(3, 1fr)" }}
          gap={3}
        >
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body py={3} px={4}>
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                Total
              </Text>
              <Text fontSize="xl" fontWeight="700" color="gray.700">
                {total}
              </Text>
            </Card.Body>
          </Card.Root>
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body py={3} px={4}>
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                Active
              </Text>
              <Text fontSize="xl" fontWeight="700" color="green.500">
                {activeDoctors}
              </Text>
            </Card.Body>
          </Card.Root>
          <Card.Root shadow="sm" rounded="xl">
            <Card.Body py={3} px={4}>
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                Inactive
              </Text>
              <Text fontSize="xl" fontWeight="700" color="red.400">
                {inactiveDoctors}
              </Text>
            </Card.Body>
          </Card.Root>
        </Grid>
      )}

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search doctors by name, specialty or qualification…"
      />

      {doctors.length === 0 ? (
        <EmptyState
          search={search}
          title="No doctors yet"
          description="Add your first doctor to get started"
          icon={<MdPerson size={36} />}
          actionLabel="Add Doctor"
          onAction={() => navigate("/hospital/doctors/add")}
        />
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap={4}>
          {doctors.map((d) => (
            <Card.Root
              key={d._id}
              shadow="sm"
              rounded="xl"
              _hover={{ shadow: "md", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <Card.Body>
                <Stack gap={3}>
                  {/* ─── Header Row ─── */}
                  <Flex justify="space-between" align="flex-start">
                    <Flex align="center" gap={3}>
                      <Avatar.Root size="lg" bg="teal.500">
                        <Avatar.Fallback name={d.name} />
                      </Avatar.Root>
                      <Box>
                        <Text fontWeight="700" fontSize="md">
                          {d.name}
                        </Text>
                        {d.qualification && (
                          <Text fontSize="xs" color="gray.500">
                            {d.qualification}
                          </Text>
                        )}
                        <Badge colorPalette="teal" size="sm" mt={1}>
                          {d.specialtyIds?.[0]?.name || "General"}
                        </Badge>
                      </Box>
                    </Flex>
                    <Badge
                      colorPalette={d.status === "active" ? "green" : "red"}
                      size="sm"
                      variant="subtle"
                    >
                      {d.status}
                    </Badge>
                  </Flex>

                  {/* ─── Key Stats ─── */}
                  <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                    <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                      <Text fontSize="xs" color="gray.400">
                        Exp
                      </Text>
                      <Text fontWeight="700" fontSize="sm">
                        {d.experience || 0}y
                      </Text>
                    </Box>
                    <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                      <Text fontSize="xs" color="gray.400">
                        Fee
                      </Text>
                      <Text fontWeight="700" fontSize="sm" color="teal.600">
                        ${d.consultationFee || 0}
                      </Text>
                    </Box>
                    <Box textAlign="center" bg="gray.50" rounded="md" py={2}>
                      <Text fontSize="xs" color="gray.400">
                        Gender
                      </Text>
                      <Text
                        fontWeight="600"
                        fontSize="sm"
                        textTransform="capitalize"
                      >
                        {d.gender || "—"}
                      </Text>
                    </Box>
                  </Grid>

                  {/* ─── Contact Info ─── */}
                  {(d.email || d.phone) && (
                    <Stack gap={1}>
                      {d.email && (
                        <Flex
                          align="center"
                          gap={2}
                          fontSize="xs"
                          color="gray.500"
                        >
                          <MdEmail size={13} /> {d.email}
                        </Flex>
                      )}
                      {d.phone && (
                        <Flex
                          align="center"
                          gap={2}
                          fontSize="xs"
                          color="gray.500"
                        >
                          <MdPhone size={13} /> {d.phone}
                        </Flex>
                      )}
                    </Stack>
                  )}

                  {/* ─── Consultation Types ─── */}
                  {d.consultationTypes?.length > 0 && (
                    <Flex gap={1} wrap="wrap">
                      {d.consultationTypes.map((type) => (
                        <Badge
                          key={type}
                          size="sm"
                          variant="outline"
                          colorPalette="blue"
                        >
                          {CONSULTATION_LABELS[type] || type}
                        </Badge>
                      ))}
                    </Flex>
                  )}

                  {/* ─── Languages ─── */}
                  {d.languages?.length > 0 && (
                    <Flex align="center" gap={1} fontSize="xs" color="gray.500">
                      <MdLanguage size={13} />
                      <Text>{d.languages.join(", ")}</Text>
                    </Flex>
                  )}

                  {/* ─── License ─── */}
                  {d.licenseNumber && (
                    <Flex align="center" gap={1} fontSize="xs" color="gray.500">
                      <MdBadge size={13} />
                      <Text>License: {d.licenseNumber}</Text>
                    </Flex>
                  )}

                  {/* ─── Actions ─── */}
                  <Flex gap={2} mt={1}>
                    <Button
                      size="sm"
                      flex={1}
                      colorPalette="teal"
                      variant="outline"
                      onClick={() => navigate(`/hospital/doctors/${d._id}`)}
                    >
                      <MdVisibility /> View
                    </Button>
                    <Button
                      size="sm"
                      flex={1}
                      variant="outline"
                      colorPalette="teal"
                      onClick={() =>
                        navigate(`/hospital/schedules/slots/${d._id}`)
                      }
                    >
                      <MdPerson /> Schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorPalette="teal"
                      onClick={() =>
                        navigate(`/hospital/doctors/edit/${d._id}`)
                      }
                    >
                      <MdEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => setDeleteTarget(d)}
                    >
                      <MdDelete />
                    </Button>
                  </Flex>
                </Stack>
              </Card.Body>
            </Card.Root>
          ))}
        </Grid>
      )}

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <Flex justify="center" align="center" gap={3} pt={2}>
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <MdChevronLeft /> Previous
          </Button>
          <Text fontSize="sm" color="gray.600" fontWeight="500">
            Page {page} of {totalPages}
          </Text>
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <MdChevronRight />
          </Button>
        </Flex>
      )}

      {/* ─── Delete Confirmation ─── */}
      <Dialog.Root
        open={!!deleteTarget}
        onOpenChange={(e) => !e.open && setDeleteTarget(null)}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="380px">
            <Dialog.Header>
              <Dialog.Title>Remove Doctor</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                Are you sure you want to remove{" "}
                <strong>{deleteTarget?.name}</strong> from your hospital?
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="red" onClick={handleDelete}>
                Remove
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  );
}
