import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Text,
  Flex,
  Button,
  Card,
  Field,
  Input,
  Textarea,
  Badge,
  Image,
} from "@chakra-ui/react";
import {
  MdUpload,
  MdCloudUpload,
  MdInsertDriveFile,
  MdOpenInNew,
  MdWarning,
  MdCheckCircle,
  MdArrowBack,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import * as appointmentSlice from "@/features/appointments/appointmentSlice";
import { selectCurrentAppointment } from "@/features/appointments/appointmentSelectors";
import * as prescriptionSlice from "@/features/prescriptions/prescriptionSlice";
import {
  selectPrescriptionUploading,
  selectPrescriptionUploaded,
  selectCurrentPrescription,
  selectPrescriptionsLoading,
} from "@/features/prescriptions/prescriptionSelectors";

const ACCEPTED_FORMATS = ".pdf,.jpg,.jpeg,.png";
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageUrl(url) {
  return /\.(jpg|jpeg|png)(\?.*)?$/i.test(url || "");
}

export default function UploadPrescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appointment = useSelector(selectCurrentAppointment);
  const uploading = useSelector(selectPrescriptionUploading);
  const uploaded = useSelector(selectPrescriptionUploaded);
  const existingPrescription = useSelector(selectCurrentPrescription);
  const loadingPrescription = useSelector(selectPrescriptionsLoading);
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const pendingFormRef = useRef(null);

  const isEditMode = !!existingPrescription;

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentByIdRequest(appointmentId));
    dispatch(
      prescriptionSlice.fetchPrescriptionByAppointmentRequest(appointmentId),
    );
    return () => dispatch(prescriptionSlice.resetUpload());
  }, [dispatch, appointmentId]);

  const handleFileSelect = useCallback((file) => {
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    if (IMAGE_TYPES.includes(file.type)) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }, []);

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files?.[0]);
  };

  // Drag & drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type
      const allowed = /jpeg|jpg|png|pdf/;
      if (!allowed.test(file.type)) return;
      // Set the file on the hidden input via DataTransfer
      const dt = new DataTransfer();
      dt.items.add(file);
      fileRef.current.files = dt.files;
      handleFileSelect(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("appointmentId", appointmentId);

    // If editing, show confirmation dialog
    if (isEditMode && !showConfirm) {
      pendingFormRef.current = formData;
      setShowConfirm(true);
      return;
    }

    dispatch(prescriptionSlice.uploadPrescriptionRequest(formData));
    setShowConfirm(false);
  };

  const handleConfirmUpdate = () => {
    if (pendingFormRef.current) {
      dispatch(
        prescriptionSlice.uploadPrescriptionRequest(pendingFormRef.current),
      );
      pendingFormRef.current = null;
    }
    setShowConfirm(false);
  };

  if (!appointment && !loadingPrescription) {
    return (
      <EmptyState
        title="Appointment not found"
        actionLabel="Back to Appointments"
        onAction={() => navigate("/hospital/appointments")}
      />
    );
  }

  if (loadingPrescription && !appointment) return <Loader />;

  // Status gating — only allow for completed appointments
  if (appointment?.status && appointment.status !== "completed") {
    return (
      <Stack gap={6} w="100%">
        <PageHeader
          title="Upload Prescription"
          backTo={`/hospital/appointments/${appointmentId}`}
        />
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex direction="column" align="center" py={10} gap={3}>
              <Box color="orange.400">
                <MdWarning size={48} />
              </Box>
              <Text fontWeight="600" color="gray.700">
                Prescription upload not available
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
                textAlign="center"
                maxW="360px"
              >
                Prescriptions can only be uploaded after the appointment is
                completed. Current status:{" "}
                <Badge colorPalette="orange">{appointment.status}</Badge>
              </Text>
              <Button
                mt={3}
                variant="outline"
                colorPalette="teal"
                onClick={() =>
                  navigate(`/hospital/appointments/${appointmentId}`)
                }
              >
                <MdArrowBack /> Back to Appointment
              </Button>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Stack>
    );
  }

  const backPath = `/hospital/appointments/${appointmentId}`;

  // Success state — inline with actions (no auto-redirect)
  if (uploaded) {
    return (
      <Stack gap={6} w="100%">
        <PageHeader
          title={isEditMode ? "Prescription Updated" : "Prescription Uploaded"}
          backTo={backPath}
        />
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Flex direction="column" align="center" py={10} gap={4}>
              <Box color="teal.500">
                <MdCheckCircle size={56} />
              </Box>
              <Text fontWeight="700" fontSize="lg" color="teal.700">
                {isEditMode
                  ? "Prescription updated successfully!"
                  : "Prescription uploaded successfully!"}
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                The prescription is now available to the patient.
              </Text>
              <Flex gap={3} mt={2}>
                {existingPrescription?.fileUrl && (
                  <Button
                    variant="outline"
                    colorPalette="teal"
                    size="sm"
                    asChild
                  >
                    <a
                      href={existingPrescription.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MdOpenInNew /> View File
                    </a>
                  </Button>
                )}
                <Button
                  colorPalette="teal"
                  size="sm"
                  onClick={() => navigate(backPath)}
                >
                  <MdArrowBack /> Back to Appointment
                </Button>
              </Flex>
            </Flex>
          </Card.Body>
        </Card.Root>
      </Stack>
    );
  }

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title={isEditMode ? "Update Prescription" : "Upload Prescription"}
        subtitle={`For: ${appointment?.patientId?.name || "Patient"} | Dr. ${appointment?.doctorId?.name || "Doctor"}`}
        backTo={backPath}
      />

      {/* Current prescription info (edit mode) */}
      {isEditMode && (
        <Card.Root
          shadow="sm"
          rounded="xl"
          borderLeft="4px solid"
          borderColor="orange.400"
        >
          <Card.Body>
            <Flex align="center" gap={2} mb={3}>
              <MdWarning size={18} color="var(--chakra-colors-orange-500)" />
              <Text fontWeight="600" fontSize="sm" color="orange.700">
                A prescription already exists for this appointment
              </Text>
            </Flex>
            <Flex align="center" gap={3} bg="gray.50" rounded="lg" p={3}>
              {isImageUrl(existingPrescription.fileUrl) ? (
                <Image
                  src={existingPrescription.fileUrl}
                  alt="Current prescription"
                  boxSize="60px"
                  objectFit="cover"
                  rounded="md"
                />
              ) : (
                <Box color="teal.500">
                  <MdInsertDriveFile size={40} />
                </Box>
              )}
              <Box flex={1}>
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  Current Prescription
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Uploaded: {formatDate(existingPrescription.updatedAt)}
                </Text>
                {existingPrescription.notes && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Notes: {existingPrescription.notes}
                  </Text>
                )}
              </Box>
              <Button size="xs" variant="outline" colorPalette="teal" asChild>
                <a
                  href={existingPrescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdOpenInNew /> View
                </a>
              </Button>
            </Flex>
            <Text fontSize="xs" color="gray.400" mt={2}>
              Uploading a new file will replace the current one. The old version
              will be saved in history.
            </Text>
          </Card.Body>
        </Card.Root>
      )}

      {/* Confirmation dialog for updates */}
      {showConfirm && (
        <Card.Root
          shadow="md"
          rounded="xl"
          borderColor="orange.300"
          borderWidth="1px"
        >
          <Card.Body>
            <Flex direction="column" gap={3}>
              <Flex align="center" gap={2}>
                <MdWarning size={20} color="var(--chakra-colors-orange-500)" />
                <Text fontWeight="700" color="orange.700">
                  Confirm Replacement
                </Text>
              </Flex>
              <Text fontSize="sm" color="gray.600">
                You&apos;re replacing the prescription from{" "}
                <strong>{formatDate(existingPrescription?.updatedAt)}</strong>.
                The current version will be archived in the history.
              </Text>
              <Flex gap={2} justify="flex-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  colorPalette="orange"
                  onClick={handleConfirmUpdate}
                  loading={uploading}
                >
                  Replace Prescription
                </Button>
              </Flex>
            </Flex>
          </Card.Body>
        </Card.Root>
      )}

      {/* Upload form */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body as="form" onSubmit={handleSubmit}>
          <Stack gap={5}>
            <Field.Root required={!isEditMode}>
              <Field.Label>
                {isEditMode ? "New Prescription File" : "Prescription File"}
              </Field.Label>
              <Box
                border="2px dashed"
                borderColor={
                  isDragging ? "teal.500" : fileName ? "teal.300" : "gray.200"
                }
                bg={isDragging ? "teal.50" : "transparent"}
                rounded="lg"
                p={6}
                textAlign="center"
                cursor="pointer"
                _hover={{ borderColor: "teal.400", bg: "teal.50" }}
                transition="all 0.15s"
                onClick={() => fileRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Input
                  ref={fileRef}
                  name="file"
                  type="file"
                  accept={ACCEPTED_FORMATS}
                  display="none"
                  onChange={handleFileChange}
                />
                {fileName ? (
                  <Flex direction="column" align="center" gap={2}>
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Preview"
                        maxH="120px"
                        maxW="200px"
                        objectFit="contain"
                        rounded="md"
                      />
                    ) : (
                      <Box color="teal.500">
                        <MdInsertDriveFile size={32} />
                      </Box>
                    )}
                    <Text fontSize="sm" fontWeight="600" color="teal.700">
                      {fileName}
                    </Text>
                    {fileSize > 0 && (
                      <Text fontSize="xs" color="gray.500">
                        {formatFileSize(fileSize)}
                      </Text>
                    )}
                    <Text fontSize="xs" color="gray.400">
                      Click or drag to change file
                    </Text>
                  </Flex>
                ) : (
                  <Flex direction="column" align="center" gap={2}>
                    <Box color={isDragging ? "teal.500" : "gray.300"}>
                      <MdCloudUpload size={40} />
                    </Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.600">
                      {isDragging
                        ? "Drop file here"
                        : "Click or drag & drop a file"}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      Accepted: PDF, JPG, PNG (max 5MB)
                    </Text>
                  </Flex>
                )}
              </Box>
            </Field.Root>

            <Field.Root>
              <Field.Label>Notes</Field.Label>
              <Textarea
                name="notes"
                rows={3}
                placeholder="Follow-up instructions, dietary advice…"
                defaultValue={
                  isEditMode ? existingPrescription?.notes || "" : ""
                }
              />
            </Field.Root>

            <Flex gap={3} justify="flex-end">
              <Button variant="outline" onClick={() => navigate(backPath)}>
                Cancel
              </Button>
              <Button
                type="submit"
                colorPalette="teal"
                loading={uploading}
                loadingText={isEditMode ? "Updating…" : "Uploading…"}
                disabled={!fileName && !isEditMode}
              >
                <MdUpload />{" "}
                {isEditMode ? "Update Prescription" : "Upload Prescription"}
              </Button>
            </Flex>
          </Stack>
        </Card.Body>
      </Card.Root>

    </Stack>
  );
}
