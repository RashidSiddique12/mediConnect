import { useState, useEffect } from "react";
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
  Select,
  Spinner,
  createListCollection,
  Dialog,
  Grid,
  Portal,
} from "@chakra-ui/react";
import {
  MdStar,
  MdCheckCircle,
  MdCancel,
  MdPerson,
  MdWarning,
  MdRateReview,
  MdSearch,
} from "react-icons/md";
import {
  fetchReviewsRequest,
  moderateReviewRequest,
} from "@/features/reviews/reviewSlice";
import {
  selectReviews,
  selectReviewsPagination,
  selectReviewsLoading,
  selectReviewsError,
} from "@/features/reviews/reviewSelectors";

const statusFilter = createListCollection({
  items: [
    { label: "All Reviews", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ],
});

function StarRating({ rating }) {
  return (
    <Flex gap={0.5}>
      {[1, 2, 3, 4, 5].map((n) => (
        <MdStar key={n} size={16} color={n <= rating ? "#F6AD55" : "#E2E8F0"} />
      ))}
    </Flex>
  );
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ReviewModeration() {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const pagination = useSelector(selectReviewsPagination);
  const loading = useSelector(selectReviewsLoading);
  const error = useSelector(selectReviewsError);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    dispatch(
      fetchReviewsRequest({
        page,
        limit: 10,
        ...(filter && { status: filter }),
      }),
    );
  }, [dispatch, filter, page]);

  const pending = reviews.filter((r) => r.status === "pending").length;

  const updateStatus = (id, status) => {
    dispatch(moderateReviewRequest({ id, status }));
    setConfirmAction(null);
  };

  const STATUS_COLOR = {
    approved: "green",
    pending: "orange",
    rejected: "red",
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" py={20}>
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body textAlign="center" py={12}>
          <Box color="red.400" mb={3}>
            <MdWarning size={40} style={{ margin: "0 auto" }} />
          </Box>
          <Text fontWeight="600" color="gray.700" mb={1}>
            Failed to load reviews
          </Text>
          <Text fontSize="sm" color="gray.500" mb={4}>
            {error}
          </Text>
          <Button
            size="sm"
            colorPalette="teal"
            onClick={() => dispatch(fetchReviewsRequest())}
          >
            Retry
          </Button>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Stack gap={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Flex align="center" gap={3}>
          <Box color="orange.500" bg="orange.50" p={2.5} rounded="xl">
            <MdRateReview size={22} />
          </Box>
          <Box>
            <Heading size="lg">Review Moderation</Heading>
            <Flex align="center" gap={2} mt={0.5}>
              <Text color="gray.500" fontSize="sm">
                {reviews.length} total reviews
              </Text>
              {pending > 0 && (
                <Badge
                  colorPalette="orange"
                  rounded="full"
                  size="sm"
                  variant="solid"
                >
                  {pending} pending
                </Badge>
              )}
            </Flex>
          </Box>
        </Flex>
        <Select.Root
          collection={statusFilter}
          w="180px"
          onValueChange={(v) => setFilter(v.value[0] || "")}
        >
          <Select.Trigger>
            <Select.ValueText placeholder="Filter status" />
          </Select.Trigger>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {statusFilter.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Flex>

      {/* Summary Cards */}
      <Grid templateColumns="repeat(auto-fit, minmax(140px, 1fr))" gap={3}>
        {[
          {
            label: "Pending",
            count: reviews.filter((r) => r.status === "pending").length,
            color: "orange",
            icon: MdWarning,
          },
          {
            label: "Approved",
            count: reviews.filter((r) => r.status === "approved").length,
            color: "green",
            icon: MdCheckCircle,
          },
          {
            label: "Rejected",
            count: reviews.filter((r) => r.status === "rejected").length,
            color: "red",
            icon: MdCancel,
          },
        ].map(({ label, count, color, icon: Icon }) => (
          <Card.Root
            key={label}
            shadow="sm"
            rounded="xl"
            cursor="pointer"
            onClick={() =>
              setFilter(
                filter === label.toLowerCase() ? "" : label.toLowerCase(),
              )
            }
            borderWidth="2px"
            borderColor={
              filter === label.toLowerCase() ? `${color}.400` : "transparent"
            }
            _hover={{ shadow: "md" }}
            transition="all 0.2s"
          >
            <Card.Body py={3} px={4}>
              <Flex align="center" gap={3}>
                <Box
                  color={`${color}.500`}
                  bg={`${color}.50`}
                  p={2}
                  rounded="lg"
                >
                  <Icon size={18} />
                </Box>
                <Box>
                  <Text
                    fontSize="2xl"
                    fontWeight="700"
                    color={`${color}.600`}
                    lineHeight="1"
                  >
                    {count}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {label}
                  </Text>
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Grid>

      {/* Review Cards */}
      <Stack gap={3}>
        {reviews.map((r) => (
          <Card.Root
            key={r._id}
            shadow="sm"
            rounded="xl"
            borderLeft="4px solid"
            borderColor={`${STATUS_COLOR[r.status]}.400`}
            _hover={{ shadow: "md" }}
            transition="all 0.15s"
          >
            <Card.Body py={4}>
              <Flex
                justify="space-between"
                align="flex-start"
                mb={3}
                wrap="wrap"
                gap={2}
              >
                <Flex align="center" gap={3}>
                  <Box bg="teal.100" p={2} rounded="full" color="teal.600">
                    <MdPerson size={20} />
                  </Box>
                  <Box>
                    <Text fontWeight="700" fontSize="sm">
                      {r.patientId?.name || "Unknown Patient"}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      About Dr. {r.doctorId?.name || "Unknown"} &bull;{" "}
                      {r.hospitalId?.name || "Unknown Hospital"}
                    </Text>
                  </Box>
                </Flex>
                <Flex align="center" gap={2}>
                  <Flex
                    align="center"
                    gap={1}
                    bg="orange.50"
                    px={2}
                    py={1}
                    rounded="md"
                  >
                    <StarRating rating={r.rating} />
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      color="orange.500"
                      ml={1}
                    >
                      {r.rating}
                    </Text>
                  </Flex>
                  <Badge
                    colorPalette={STATUS_COLOR[r.status]}
                    size="sm"
                    textTransform="capitalize"
                  >
                    {r.status}
                  </Badge>
                </Flex>
              </Flex>

              <Box
                bg="gray.50"
                p={3}
                rounded="lg"
                mb={3}
                borderLeft="3px solid"
                borderColor="gray.200"
              >
                <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                  &ldquo;{r.comment}&rdquo;
                </Text>
              </Box>

              <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                <Text
                  fontSize="xs"
                  color="gray.400"
                  title={new Date(r.createdAt).toLocaleString()}
                >
                  {timeAgo(r.createdAt)}
                </Text>
                {r.status === "pending" && (
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      colorPalette="green"
                      onClick={() => updateStatus(r._id, "approved")}
                    >
                      <MdCheckCircle /> Approve
                    </Button>
                    <Button
                      size="sm"
                      colorPalette="red"
                      variant="outline"
                      onClick={() =>
                        setConfirmAction({
                          id: r._id,
                          action: "rejected",
                          patient: r.patientId?.name,
                        })
                      }
                    >
                      <MdCancel /> Reject
                    </Button>
                  </Flex>
                )}
                {r.status === "approved" && (
                  <Button
                    size="sm"
                    colorPalette="red"
                    variant="ghost"
                    onClick={() =>
                      setConfirmAction({
                        id: r._id,
                        action: "rejected",
                        patient: r.patientId?.name,
                      })
                    }
                  >
                    Revoke Approval
                  </Button>
                )}
                {r.status === "rejected" && (
                  <Button
                    size="sm"
                    colorPalette="green"
                    variant="ghost"
                    onClick={() => updateStatus(r._id, "approved")}
                  >
                    Reinstate
                  </Button>
                )}
              </Flex>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>

      {reviews.length === 0 && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body textAlign="center" py={12}>
            <MdStar
              size={48}
              style={{ margin: "0 auto 12px", opacity: 0.3, color: "#CBD5E0" }}
            />
            <Text fontWeight="600" color="gray.500" mb={1}>
              No reviews found
            </Text>
            <Text fontSize="sm" color="gray.400">
              {filter
                ? `No ${filter} reviews. Try a different filter.`
                : "Reviews will appear here once patients submit them."}
            </Text>
            {filter && (
              <Button
                size="sm"
                variant="outline"
                colorPalette="teal"
                mt={3}
                onClick={() => setFilter("")}
              >
                Clear Filter
              </Button>
            )}
          </Card.Body>
        </Card.Root>
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

      {/* Confirm Reject Dialog */}
      <Dialog.Root
        open={!!confirmAction}
        onOpenChange={(e) => {
          if (!e.open) setConfirmAction(null);
        }}
      >
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content rounded="xl" maxW="400px">
            <Dialog.Header>
              <Flex align="center" gap={2}>
                <Box color="red.500">
                  <MdWarning size={20} />
                </Box>
                <Dialog.Title>Confirm Rejection</Dialog.Title>
              </Flex>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontSize="sm" color="gray.600">
                Are you sure you want to reject this review from{" "}
                <Text as="span" fontWeight="700">
                  {confirmAction?.patient || "this patient"}
                </Text>
                ? The review will be hidden from public view.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button
                colorPalette="red"
                onClick={() =>
                  updateStatus(confirmAction?.id, confirmAction?.action)
                }
              >
                Reject Review
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  );
}
