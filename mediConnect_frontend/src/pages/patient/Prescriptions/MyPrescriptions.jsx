import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Badge,
  Card,
  Grid,
  Button,
  Avatar,
  Input,
} from "@chakra-ui/react";
import {
  MdDescription,
  MdDownload,
  MdSearch,
  MdFilterList,
} from "react-icons/md";
import Loader from "@/components/common/Loader";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import SearchInput from "@/components/common/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import * as prescriptionSlice from "@/features/prescriptions/prescriptionSlice";
import * as prescriptionSelectors from "@/features/prescriptions/prescriptionSelectors";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MyPrescriptions() {
  const dispatch = useDispatch();
  const prescriptions = useSelector(prescriptionSelectors.selectPrescriptions);
  const pagination = useSelector(prescriptionSelectors.selectPrescriptionsPagination);
  const loading = useSelector(prescriptionSelectors.selectPrescriptionsLoading);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(
      prescriptionSlice.fetchPrescriptionsRequest({
        page,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
      }),
    );
  }, [dispatch, page, debouncedSearch]);

  if (loading) return <Loader />;

  return (
    <Stack gap={6}>
      <PageHeader
        title="My Prescriptions"
        subtitle={`${pagination?.total || prescriptions.length} prescription${(pagination?.total || prescriptions.length) !== 1 ? "s" : ""} on record`}
      />

      {/* Search bar */}
      {(prescriptions.length > 0 || search) && (
        <Flex gap={3} align="center" wrap="wrap">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by diagnosis, doctor, or medicine…"
            maxW="400px"
          />
          <Text fontSize="sm" color="gray.400">
            {pagination?.total || prescriptions.length} result{(pagination?.total || prescriptions.length) !== 1 ? "s" : ""}
          </Text>
        </Flex>
      )}

      {prescriptions.length === 0 && !search && (
        <EmptyState
          icon={<MdDescription size={36} />}
          title="No prescriptions yet"
          description="Your prescriptions will appear here after a doctor visit."
        />
      )}

      {prescriptions.length === 0 && search && (
        <EmptyState
          icon={<MdSearch size={36} />}
          search={search}
          searchEmptyText={`No prescriptions matching "${search}"`}
          actionLabel="Clear Search"
          onAction={() => setSearch("")}
          withCard={false}
        />
      )}

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fill, minmax(340px, 1fr))",
        }}
        gap={4}
      >
        {prescriptions.map((rx) => (
          <Card.Root
            key={rx._id}
            shadow="sm"
            rounded="xl"
            overflow="hidden"
            _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            {/* Prescription header */}
            <Box
              bgGradient="to-r"
              gradientFrom="teal.600"
              gradientTo="teal.700"
              px={5}
              py={4}
              color="white"
            >
              <Flex justify="space-between" align="flex-start">
                <Box>
                  <Flex align="center" gap={2} mb={1}>
                    <MdDescription size={18} />
                    <Text fontWeight="700" fontSize="sm">
                      Prescription
                    </Text>
                  </Flex>
                  <Text opacity={0.7} fontSize="xs">
                    {formatDate(rx.createdAt || rx.date)}
                  </Text>
                </Box>
                <Badge bg="whiteAlpha.300" color="white" size="sm">
                  #{rx._id?.slice(-6)}
                </Badge>
              </Flex>
            </Box>

            <Card.Body>
              {/* Doctor info */}
              <Flex
                align="center"
                gap={2}
                mb={4}
                pb={3}
                borderBottomWidth="1px"
              >
                <Avatar.Root size="sm" bg="teal.500">
                  <Avatar.Fallback name={rx.doctorId?.name || "Doctor"} />
                </Avatar.Root>
                <Box flex={1}>
                  <Text fontWeight="600" fontSize="sm">
                    {rx.doctorId?.name || "Doctor"}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Prescribing physician
                  </Text>
                </Box>
              </Flex>

              {/* Diagnosis */}
              <Box bg="teal.50" rounded="lg" p={3} mb={4}>
                <Text fontSize="xs" color="gray.500" mb={1}>
                  Diagnosis
                </Text>
                <Text fontWeight="700" color="teal.700">
                  {rx.diagnosis}
                </Text>
              </Box>

              {/* Medicines */}
              <Box mb={4}>
                <Text
                  fontWeight="600"
                  fontSize="xs"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={2}
                >
                  Medicines ({rx.medicines?.length || 0})
                </Text>
                <Stack gap={2}>
                  {(rx.medicines || []).map((m, i) => (
                    <Flex
                      key={i}
                      justify="space-between"
                      align="center"
                      bg="gray.50"
                      rounded="md"
                      px={3}
                      py={2}
                    >
                      <Box>
                        <Text fontSize="sm" fontWeight="600">
                          {m.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {m.dosage}
                        </Text>
                      </Box>
                      <Badge colorPalette="teal" size="sm" variant="outline">
                        {m.duration}
                      </Badge>
                    </Flex>
                  ))}
                </Stack>
              </Box>

              {/* Notes */}
              {rx.notes && (
                <Box
                  bg="yellow.50"
                  rounded="lg"
                  p={3}
                  mb={4}
                  borderLeft="3px solid"
                  borderColor="yellow.400"
                >
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Doctor's Notes
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {rx.notes}
                  </Text>
                </Box>
              )}

              <Button w="full" variant="outline" colorPalette="teal" size="sm">
                <MdDownload /> Download PDF
              </Button>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

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
