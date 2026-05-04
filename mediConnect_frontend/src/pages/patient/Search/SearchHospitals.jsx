import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  Button,
} from "@chakra-ui/react";
import {
  MdSearch,
  MdLocalHospital,
  MdLocationOn,
  MdStar,
  MdPerson,
  MdArrowForward,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import useDebounce from "@/hooks/useDebounce";
import * as hospitalSlice from "@/features/hospitals/hospitalSlice";
import * as hospitalSelectors from "@/features/hospitals/hospitalSelectors";

const LIMIT = 10;

export default function SearchHospitals() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hospitals = useSelector(hospitalSelectors.selectHospitals);
  const pagination = useSelector(hospitalSelectors.selectHospitalsPagination);
  const loading = useSelector(hospitalSelectors.selectHospitalsLoading);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const fetchData = useCallback(
    (p, s) => {
      const params = { page: p, limit: LIMIT, status: "active" };
      if (s) params.search = s;
      dispatch(hospitalSlice.fetchHospitalsRequest(params));
    },
    [dispatch],
  );

  useEffect(() => {
    setPage(1);
    fetchData(1, debouncedSearch);
  }, [debouncedSearch, fetchData]);

  useEffect(() => {
    fetchData(page, debouncedSearch);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

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
          Find a Hospital
        </Heading>
        <Text opacity={0.8} mb={6} fontSize={{ base: "sm", md: "md" }}>
          Discover quality healthcare facilities near you
        </Text>
        <Flex justify="center">
          <Box position="relative" w="full" maxW="500px">
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
              placeholder="Search by hospital name or city…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              _placeholder={{ color: "gray.400" }}
              rounded="xl"
              shadow="sm"
            />
          </Box>
        </Flex>
      </Box>

      {/* Results count */}
      <Flex justify="space-between" align="center">
        <Text color="gray.500" fontSize="sm">
          {total} hospital{total !== 1 ? "s" : ""} found
        </Text>
        {search && (
          <Button
            size="xs"
            variant="ghost"
            colorPalette="red"
            onClick={() => setSearch("")}
          >
            Clear search
          </Button>
        )}
      </Flex>

      {/* Loading */}
      {loading && <Loader />}

      {/* Hospital Cards */}
      {!loading && hospitals.length === 0 ? (
        <EmptyState
          icon={<MdLocalHospital size={36} />}
          search={search}
          title="No hospitals available"
          description="There are no hospitals registered yet."
          actionLabel={search ? "Clear Search" : undefined}
          onAction={search ? () => setSearch("") : undefined}
        />
      ) : (
        !loading && (
          <>
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
              gap={4}
            >
              {hospitals.map((h) => (
                <Card.Root
                  key={h._id || h.id}
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
                      <Box
                        bg="teal.50"
                        p={3}
                        rounded="xl"
                        color="teal.600"
                        fontSize="2xl"
                        flexShrink={0}
                      >
                        <MdLocalHospital />
                      </Box>
                      <Box flex={1}>
                        <Text fontWeight="700" fontSize="md">
                          {h.name}
                        </Text>
                        <Flex align="center" gap={1} color="gray.500" mt={1}>
                          <MdLocationOn size={14} />
                          <Text fontSize="xs">{h.address?.city || "N/A"}</Text>
                        </Flex>
                      </Box>
                    </Flex>

                    <Grid templateColumns="repeat(3, 1fr)" gap={2} mb={4}>
                      <Box textAlign="center" bg="teal.50" rounded="xl" py={3}>
                        <Flex justify="center" mb={1}>
                          <MdPerson size={16} color="#0d9488" />
                        </Flex>
                        <Text fontSize="xs" color="gray.500">
                          Doctors
                        </Text>
                        <Text fontWeight="700" fontSize="sm" color="teal.700">
                          {h.totalDoctors || 0}
                        </Text>
                      </Box>
                      <Box
                        textAlign="center"
                        bg="orange.50"
                        rounded="xl"
                        py={3}
                      >
                        <Flex justify="center" mb={1}>
                          <MdArrowForward size={16} color="#ea580c" />
                        </Flex>
                        <Text fontSize="xs" color="gray.500">
                          Visits
                        </Text>
                        <Text fontWeight="700" fontSize="sm" color="orange.600">
                          {h.totalAppointments || 0}
                        </Text>
                      </Box>
                      <Box
                        textAlign="center"
                        bg="yellow.50"
                        rounded="xl"
                        py={3}
                      >
                        <Flex justify="center" mb={1}>
                          <MdStar size={16} color="#F6AD55" />
                        </Flex>
                        <Text fontSize="xs" color="gray.500">
                          Rating
                        </Text>
                        <Text fontWeight="700" fontSize="sm" color="yellow.700">
                          {h.rating || "N/A"}
                        </Text>
                      </Box>
                    </Grid>

                    <Button
                      w="full"
                      colorPalette="teal"
                      onClick={() =>
                        navigate(`/patient/doctors?hospital=${h._id}`)
                      }
                      _hover={{ transform: "translateY(-1px)", shadow: "sm" }}
                      transition="all 0.2s"
                    >
                      View Doctors <MdArrowForward />
                    </Button>
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
