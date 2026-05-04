import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Input,
  Card,
  Grid,
  Badge,
  Button,
  Avatar,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import {
  MdSearch,
  MdStar,
  MdPerson,
  MdArrowForward,
  MdLocalHospital,
  MdAccessTime,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import useDebounce from "@/hooks/useDebounce";
import * as doctorSlice from "@/features/doctors/doctorSlice";
import * as doctorSelectors from "@/features/doctors/doctorSelectors";
import * as specialtySlice from "@/features/specialties/specialtySlice";
import * as specialtySelectors from "@/features/specialties/specialtySelectors";
import * as hospitalSlice from "@/features/hospitals/hospitalSlice";
import * as hospitalSelectors from "@/features/hospitals/hospitalSelectors";

function StarRating({ rating }) {
  return (
    <Flex gap={0.5} align="center">
      {[1, 2, 3, 4, 5].map((n) => (
        <MdStar
          key={n}
          size={14}
          color={n <= Math.round(rating) ? "#F6AD55" : "#E2E8F0"}
        />
      ))}
      {rating > 0 && (
        <Text fontSize="xs" fontWeight="600" ml={0.5} color="gray.600">
          {Number(rating).toFixed(1)}
        </Text>
      )}
    </Flex>
  );
}

const LIMIT = 10;

export default function SearchDoctors() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialHospital = searchParams.get("hospital") || "";

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [hospital, setHospital] = useState(initialHospital);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const doctors = useSelector(doctorSelectors.selectDoctors);
  const pagination = useSelector(doctorSelectors.selectDoctorsPagination);
  const specialties = useSelector(specialtySelectors.selectSpecialties);
  const hospitals = useSelector(hospitalSelectors.selectHospitals);
  const loading = useSelector(doctorSelectors.selectDoctorsLoading);

  // Fetch reference data once
  useEffect(() => {
    dispatch(specialtySlice.fetchSpecialtiesRequest({ limit: 100 }));
    dispatch(
      hospitalSlice.fetchHospitalsRequest({ limit: 100, status: "active" }),
    );
  }, [dispatch]);

  const fetchDoctors = useCallback(
    (p, s, spec, hosp) => {
      const params = { page: p, limit: LIMIT };
      if (s) params.search = s;
      if (spec) params.specialtyId = spec;
      if (hosp) params.hospitalId = hosp;
      dispatch(doctorSlice.fetchDoctorsRequest(params));
    },
    [dispatch],
  );

  // Reset page on filter/search change
  useEffect(() => {
    setPage(1);
    fetchDoctors(1, debouncedSearch, specialty, hospital);
  }, [debouncedSearch, specialty, hospital, fetchDoctors]);

  // Fetch on page change
  useEffect(() => {
    if (page > 1) fetchDoctors(page, debouncedSearch, specialty, hospital);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const specialtyCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "All Specialties", value: "" },
          ...specialties.map((s) => ({ label: s.name, value: s._id })),
        ],
      }),
    [specialties],
  );

  const hospitalCollection = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "All Hospitals", value: "" },
          ...hospitals.map((h) => ({ label: h.name, value: h._id })),
        ],
      }),
    [hospitals],
  );

  const getDoctorName = (d) => d.userId?.name || d.name || "Doctor";
  const getSpecialtyName = (d) =>
    (d.specialtyIds || []).map((s) => s.name || s).join(", ") || "General";
  const getHospitalName = (doc) => doc.hospitalId?.name || "N/A";

  const clearFilters = () => {
    setSearch("");
    setSpecialty("");
    setHospital("");
  };

  const hasActiveFilters = search || specialty || hospital;
  const totalPages = pagination?.totalPages || 1;
  const total = pagination?.total || 0;

  return (
    <Stack gap={6}>
      {/* Hero */}
      <Box
        bgGradient="to-br"
        gradientFrom="teal.600"
        gradientTo="teal.800"
        color="white"
        p={{ base: 6, md: 10 }}
        rounded="2xl"
        textAlign="center"
      >
        <Heading size={{ base: "lg", md: "xl" }} mb={2} color="white">
          Find a Doctor
        </Heading>
        <Text opacity={0.8} mb={6} fontSize={{ base: "sm", md: "md" }}>
          Book an appointment with the best specialists
        </Text>
        <Box position="relative" maxW="500px" mx="auto">
          <Box
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            color="gray.400"
            zIndex={1}
          >
            <MdSearch size={20} />
          </Box>
          <Input
            pl={11}
            size="lg"
            bg="white"
            color="gray.800"
            placeholder="Search by doctor name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            _placeholder={{ color: "gray.400" }}
            rounded="xl"
            shadow="sm"
          />
        </Box>
      </Box>

      {/* Filters */}
      <Flex gap={3} wrap="wrap" align="center">
        <Select.Root
          collection={specialtyCollection}
          w={{ base: "full", sm: "220px" }}
          onValueChange={(v) => setSpecialty(v.value[0] || "")}
        >
          <Select.Trigger>
            <Select.ValueText placeholder="All Specialties" />
          </Select.Trigger>
          <Select.Content>
            {specialtyCollection.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root
          collection={hospitalCollection}
          w={{ base: "full", sm: "240px" }}
          defaultValue={initialHospital ? [initialHospital] : []}
          onValueChange={(v) => setHospital(v.value[0] || "")}
        >
          <Select.Trigger>
            <Select.ValueText placeholder="All Hospitals" />
          </Select.Trigger>
          <Select.Content>
            {hospitalCollection.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Flex align="center" gap={2} ml="auto">
          <Text color="gray.500" fontSize="sm">
            {total} doctor{total !== 1 ? "s" : ""} found
          </Text>
          {hasActiveFilters && (
            <Button
              size="xs"
              variant="ghost"
              colorPalette="red"
              onClick={clearFilters}
            >
              Clear
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Loading */}
      {loading && <Loader />}

      {/* Doctor Cards */}
      {!loading && doctors.length === 0 ? (
        <EmptyState
          icon={<MdPerson size={36} />}
          title={hasActiveFilters ? "No doctors found" : "No doctors available"}
          description={
            hasActiveFilters
              ? "Try adjusting your search or filters."
              : "There are no doctors registered yet."
          }
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        !loading && (
          <>
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(auto-fill, minmax(290px, 1fr))",
              }}
              gap={4}
            >
              {doctors.map((d) => (
                <Card.Root
                  key={d._id}
                  shadow="sm"
                  rounded="xl"
                  _hover={{ shadow: "lg", transform: "translateY(-3px)" }}
                  transition="all 0.25s"
                  overflow="hidden"
                >
                  <Box
                    h={2}
                    bgGradient="to-r"
                    gradientFrom="teal.400"
                    gradientTo="teal.600"
                  />
                  <Card.Body>
                    <Flex align="flex-start" gap={3} mb={4}>
                      <Avatar.Root size="lg" bg="teal.500" flexShrink={0}>
                        <Avatar.Fallback name={getDoctorName(d)} />
                      </Avatar.Root>
                      <Box flex={1}>
                        <Text fontWeight="700">{getDoctorName(d)}</Text>
                        <Badge colorPalette="teal" size="sm" mt={0.5}>
                          {getSpecialtyName(d)}
                        </Badge>
                        <StarRating rating={d.rating || 0} />
                      </Box>
                    </Flex>

                    <Stack gap={2} mb={4}>
                      <Flex justify="space-between" align="center">
                        <Flex align="center" gap={1}>
                          <MdLocalHospital size={12} color="#718096" />
                          <Text fontSize="xs" color="gray.500">
                            Hospital
                          </Text>
                        </Flex>
                        <Text fontSize="xs" fontWeight="600">
                          {getHospitalName(d)}
                        </Text>
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Flex align="center" gap={1}>
                          <MdAccessTime size={12} color="#718096" />
                          <Text fontSize="xs" color="gray.500">
                            Experience
                          </Text>
                        </Flex>
                        <Text fontSize="xs" fontWeight="600">
                          {d.experience || 0} years
                        </Text>
                      </Flex>
                      <Flex
                        justify="space-between"
                        align="center"
                        pt={1}
                        borderTopWidth="1px"
                      >
                        <Text fontSize="xs" color="gray.500">
                          Consultation Fee
                        </Text>
                        <Text fontSize="sm" fontWeight="700" color="teal.600">
                          ${d.consultationFee || d.fee || 0}
                        </Text>
                      </Flex>
                    </Stack>

                    <Grid templateColumns="1fr 1fr" gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorPalette="teal"
                        onClick={() => navigate(`/patient/doctors/${d._id}`)}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        colorPalette="teal"
                        onClick={() => navigate(`/patient/book/${d._id}`)}
                      >
                        Book Now <MdArrowForward />
                      </Button>
                    </Grid>
                  </Card.Body>
                </Card.Root>
              ))}
            </Grid>

            {/* Pagination */}
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
                <Text fontSize="sm" color="gray.600">
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
          </>
        )
      )}
    </Stack>
  );
}
