import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Heading,
  Text,
  Flex,
  Button,
  Card,
  Grid,
  Badge,
  Input,
  Field,
  Select,
  createListCollection,
  GridItem,
} from "@chakra-ui/react";
import {
  MdAdd,
  MdDelete,
  MdSchedule,
  MdChevronLeft,
  MdChevronRight,
  MdCalendarToday,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import * as doctorSlice from "@/features/doctors/doctorSlice";
import {
  selectCurrentDoctor,
  selectDoctorsLoading,
} from "@/features/doctors/doctorSelectors";
import * as scheduleSlice from "@/features/schedules/scheduleSlice";
import {
  selectSchedules,
  selectSchedulesSaving,
} from "@/features/schedules/scheduleSelectors";

const DURATION_COLLECTION = createListCollection({
  items: [
    { label: "15 min", value: 15 },
    { label: "20 min", value: 20 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "60 min", value: 60 },
  ],
});

const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(d) {
  if (typeof d === "string") return d.split("T")[0];
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${yr}-${mo}-${da}`;
}

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function generateSlots(start, end, intervalMins = 30) {
  const slots = [];
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let curr = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (curr < endMin) {
    const h = String(Math.floor(curr / 60)).padStart(2, "0");
    const m = String(curr % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    curr += intervalMins;
  }
  return slots;
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

/* ─── Mini Calendar ─── */
function MiniCalendar({
  year,
  month,
  onMonthChange,
  scheduledDates,
  selectedDates,
  onToggleDate,
}) {
  const days = getMonthDays(year, month);
  const todayKey = toDateKey(new Date());
  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handlePrev = () => {
    if (month === 0) onMonthChange(year - 1, 11);
    else onMonthChange(year, month - 1);
  };
  const handleNext = () => {
    if (month === 11) onMonthChange(year + 1, 0);
    else onMonthChange(year, month + 1);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        <Button size="xs" variant="ghost" onClick={handlePrev}>
          <MdChevronLeft />
        </Button>
        <Text fontWeight="700" fontSize="sm">
          {monthLabel}
        </Text>
        <Button size="xs" variant="ghost" onClick={handleNext}>
          <MdChevronRight />
        </Button>
      </Flex>
      <Grid templateColumns="repeat(7, 1fr)" gap={1}>
        {WEEKDAY_HEADERS.map((h) => (
          <Box
            key={h}
            textAlign="center"
            fontSize="xs"
            fontWeight="600"
            color="gray.500"
            py={1}
          >
            {h}
          </Box>
        ))}
        {days.map((day, idx) => {
          if (day === null) return <Box key={`e-${idx}`} />;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isScheduled = scheduledDates.has(dateKey);
          const isSelected = selectedDates.includes(dateKey);
          const isPast = dateKey < todayKey;
          return (
            <Box
              key={dateKey}
              textAlign="center"
              py={1.5}
              fontSize="xs"
              fontWeight={isScheduled || isSelected ? "700" : "400"}
              rounded="md"
              cursor={isPast ? "default" : "pointer"}
              opacity={isPast ? 0.4 : 1}
              bg={
                isSelected
                  ? "teal.500"
                  : isScheduled
                    ? "teal.100"
                    : dateKey === todayKey
                      ? "gray.100"
                      : "transparent"
              }
              color={
                isSelected ? "white" : isScheduled ? "teal.700" : "inherit"
              }
              _hover={
                !isPast
                  ? { bg: isSelected ? "teal.600" : "teal.50" }
                  : undefined
              }
              onClick={() => !isPast && onToggleDate(dateKey)}
            >
              {day}
            </Box>
          );
        })}
      </Grid>
      <Flex gap={3} mt={3} wrap="wrap">
        <Flex align="center" gap={1}>
          <Box w={3} h={3} rounded="sm" bg="teal.100" />{" "}
          <Text fontSize="xs" color="gray.500">
            Has schedule
          </Text>
        </Flex>
        <Flex align="center" gap={1}>
          <Box w={3} h={3} rounded="sm" bg="teal.500" />{" "}
          <Text fontSize="xs" color="gray.500">
            Selected
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}

export default function ManageSlots() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctor = useSelector(selectCurrentDoctor);
  const doctorLoading = useSelector(selectDoctorsLoading);
  const schedules = useSelector(selectSchedules);
  const saving = useSelector(selectSchedulesSaving);

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDates, setSelectedDates] = useState([]);
  const [form, setForm] = useState({
    startTime: "09:00",
    endTime: "13:00",
    slotDuration: 30,
  });
  // date range quick-fill
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorByIdRequest(doctorId));
    dispatch(scheduleSlice.fetchSchedulesRequest({ doctorId }));
    return () => dispatch(doctorSlice.clearCurrentDoctor());
  }, [dispatch, doctorId]);

  const doctorSchedules = useMemo(
    () =>
      schedules
        .filter((s) => (s.doctorId?._id || s.doctorId) === doctorId)
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [schedules, doctorId],
  );

  const scheduledDateSet = useMemo(() => {
    const set = new Set();
    for (const s of doctorSchedules) set.add(toDateKey(s.date));
    return set;
  }, [doctorSchedules]);

  const upcomingSchedules = useMemo(
    () =>
      doctorSchedules.filter((s) => toDateKey(s.date) >= toDateKey(new Date())),
    [doctorSchedules],
  );

  const pastSchedules = useMemo(
    () =>
      doctorSchedules.filter((s) => toDateKey(s.date) < toDateKey(new Date())),
    [doctorSchedules],
  );

  const toggleDate = useCallback((dateKey) => {
    setSelectedDates((prev) =>
      prev.includes(dateKey)
        ? prev.filter((d) => d !== dateKey)
        : [...prev, dateKey].sort(),
    );
  }, []);

  const handleApplyRange = () => {
    if (!rangeFrom || !rangeTo || rangeFrom > rangeTo) return;
    const dates = [];
    const todayKey = toDateKey(new Date());
    const cur = new Date(rangeFrom + "T00:00:00");
    const end = new Date(rangeTo + "T00:00:00");
    while (cur <= end) {
      const key = toDateKey(cur);
      if (key >= todayKey) dates.push(key);
      cur.setDate(cur.getDate() + 1);
    }
    setSelectedDates((prev) => [...new Set([...prev, ...dates])].sort());
  };

  const handleMonthChange = (y, m) => {
    setCalYear(y);
    setCalMonth(m);
  };

  if (doctorLoading) return <Loader />;

  if (!doctor && !doctorLoading) {
    return (
      <EmptyState
        title="Doctor not found"
        description="The doctor you're looking for doesn't exist"
        actionLabel="Back to Schedules"
        onAction={() => navigate("/hospital/schedules")}
      />
    );
  }

  const handleAddSchedules = (e) => {
    e.preventDefault();
    if (selectedDates.length === 0) return;

    if (selectedDates.length === 1) {
      dispatch(
        scheduleSlice.createScheduleRequest({
          doctorId,
          date: selectedDates[0],
          startTime: form.startTime,
          endTime: form.endTime,
          slotDuration: Number(form.slotDuration),
        }),
      );
    } else {
      dispatch(
        scheduleSlice.createBulkSchedulesRequest({
          doctorId,
          dates: selectedDates,
          startTime: form.startTime,
          endTime: form.endTime,
          slotDuration: Number(form.slotDuration),
        }),
      );
    }
    setSelectedDates([]);
  };

  const handleRemoveSchedule = (id) =>
    dispatch(scheduleSlice.deleteScheduleRequest(id));

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title="Manage Schedules"
        subtitle={`${doctor?.name} — ${doctor?.specialtyIds?.[0]?.name || "General"}`}
        backTo="/hospital/schedules"
      />

      {/* ─── Create Schedule Form ─── */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Header>
          <Heading size="md">Add Schedule for Dates</Heading>
          <Text fontSize="sm" color="gray.500">
            Select dates on the calendar or use the date range picker, then set
            the time
          </Text>
        </Card.Header>
        <Card.Body as="form" onSubmit={handleAddSchedules}>
          <Grid templateColumns={{ base: "1fr", md: "280px 1fr" }} gap={5}>
            {/* Calendar */}
            <Box>
              <MiniCalendar
                year={calYear}
                month={calMonth}
                onMonthChange={handleMonthChange}
                scheduledDates={scheduledDateSet}
                selectedDates={selectedDates}
                onToggleDate={toggleDate}
              />
              {/* Quick date range selector */}
              <Box mt={4} p={3} bg="gray.50" rounded="md">
                <Text fontSize="xs" fontWeight="600" mb={2} color="gray.600">
                  Quick Date Range
                </Text>
                <Stack gap={2}>
                  <Input
                    type="date"
                    size="sm"
                    value={rangeFrom}
                    min={toDateKey(new Date())}
                    onChange={(e) => setRangeFrom(e.target.value)}
                    placeholder="From"
                  />
                  <Input
                    type="date"
                    size="sm"
                    value={rangeTo}
                    min={rangeFrom || toDateKey(new Date())}
                    onChange={(e) => setRangeTo(e.target.value)}
                    placeholder="To"
                  />
                  <Button
                    size="xs"
                    variant="outline"
                    colorPalette="teal"
                    onClick={handleApplyRange}
                    disabled={!rangeFrom || !rangeTo}
                  >
                    Select Range
                  </Button>
                </Stack>
              </Box>
            </Box>

            {/* Time & Duration Settings */}
            <Stack gap={4}>
              {selectedDates.length > 0 && (
                <Box>
                  <Text fontSize="sm" fontWeight="600" mb={2}>
                    Selected Dates ({selectedDates.length})
                  </Text>
                  <Flex gap={1.5} wrap="wrap">
                    {selectedDates.map((d) => (
                      <Badge
                        key={d}
                        colorPalette="teal"
                        size="sm"
                        cursor="pointer"
                        onClick={() => toggleDate(d)}
                      >
                        {new Date(d + "T00:00:00").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {" ×"}
                      </Badge>
                    ))}
                    {selectedDates.length > 1 && (
                      <Badge
                        colorPalette="red"
                        variant="outline"
                        size="sm"
                        cursor="pointer"
                        onClick={() => setSelectedDates([])}
                      >
                        Clear all
                      </Badge>
                    )}
                  </Flex>
                </Box>
              )}

              <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={3}>
                <Field.Root required>
                  <Field.Label>Start Time</Field.Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, startTime: e.target.value }))
                    }
                  />
                </Field.Root>
                <Field.Root required>
                  <Field.Label>End Time</Field.Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, endTime: e.target.value }))
                    }
                  />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Slot Duration</Field.Label>
                  <Select.Root
                    collection={DURATION_COLLECTION}
                    value={[form.slotDuration]}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, slotDuration: v.value[0] ?? 30 }))
                    }
                  >
                    <Select.Trigger>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.Content>
                      {DURATION_COLLECTION.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>
              </Grid>

              {/* Slot Preview */}
              {form.startTime && form.endTime && (
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Slot Preview (
                    {
                      generateSlots(
                        form.startTime,
                        form.endTime,
                        form.slotDuration,
                      ).length
                    }{" "}
                    slots)
                  </Text>
                  <Flex gap={1.5} wrap="wrap">
                    {generateSlots(
                      form.startTime,
                      form.endTime,
                      form.slotDuration,
                    ).map((slot) => (
                      <Badge
                        key={slot}
                        colorPalette="gray"
                        variant="outline"
                        size="sm"
                      >
                        {slot}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              )}

              <Flex justify="flex-end">
                <Button
                  type="submit"
                  colorPalette="teal"
                  loading={saving}
                  disabled={selectedDates.length === 0}
                >
                  <MdAdd />
                  {selectedDates.length <= 1
                    ? "Add Schedule"
                    : `Add ${selectedDates.length} Schedules`}
                </Button>
              </Flex>
            </Stack>
          </Grid>
        </Card.Body>
      </Card.Root>

      {/* ─── Upcoming Schedules ─── */}
      <Stack gap={4}>
        <Text fontWeight="700" fontSize="md" color="gray.700">
          Upcoming Schedules ({upcomingSchedules.length})
        </Text>
        {upcomingSchedules.length === 0 ? (
          <EmptyState
            title="No upcoming schedules"
            description="Select dates above and set time to create schedules"
            icon={<MdCalendarToday size={36} />}
          />
        ) : (
          upcomingSchedules.map((s) => {
            const previewSlots = generateSlots(
              s.startTime,
              s.endTime,
              s.slotDuration,
            );
            return (
              <Card.Root key={s._id} shadow="sm" rounded="xl">
                <Card.Body>
                  <Flex justify="space-between" align="center" mb={3}>
                    <Flex align="center" gap={2}>
                      <Badge colorPalette="teal" size="md">
                        {formatDateDisplay(s.date)}
                      </Badge>
                      <Text fontSize="sm" color="gray.600">
                        {s.startTime} – {s.endTime}
                      </Text>
                      <Badge colorPalette="blue" size="sm">
                        {previewSlots.length} slots
                      </Badge>
                      <Badge colorPalette="purple" size="sm">
                        {s.slotDuration}min
                      </Badge>
                    </Flex>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="red"
                      onClick={() => handleRemoveSchedule(s._id)}
                    >
                      <MdDelete />
                    </Button>
                  </Flex>
                  <Flex gap={2} wrap="wrap">
                    {previewSlots.map((slot) => (
                      <Badge
                        key={slot}
                        colorPalette="gray"
                        variant="outline"
                        size="sm"
                      >
                        {slot}
                      </Badge>
                    ))}
                  </Flex>
                </Card.Body>
              </Card.Root>
            );
          })
        )}
      </Stack>

      {/* ─── Past Schedules (collapsed summary) ─── */}
      {pastSchedules.length > 0 && (
        <Box>
          <Text fontWeight="600" fontSize="sm" color="gray.400" mb={2}>
            Past Schedules ({pastSchedules.length})
          </Text>
          <Flex gap={1.5} wrap="wrap">
            {pastSchedules.map((s) => (
              <Badge
                key={s._id}
                colorPalette="gray"
                variant="outline"
                size="sm"
              >
                {new Date(s.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            ))}
          </Flex>
        </Box>
      )}
    </Stack>
  );
}
