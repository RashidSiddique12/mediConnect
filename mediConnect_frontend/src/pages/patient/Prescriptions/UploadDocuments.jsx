import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Text,
  Flex,
  Button,
  Card,
  Input,
  Field,
  Spinner,
} from "@chakra-ui/react";
import {
  MdUploadFile,
  MdCheckCircle,
  MdDescription,
  MdArrowForward,
} from "react-icons/md";
import PageHeader from "@/components/common/PageHeader";
import * as prescriptionSlice from "@/features/prescriptions/prescriptionSlice";
import * as prescriptionSelectors from "@/features/prescriptions/prescriptionSelectors";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE_MB = 5;

export default function UploadDocuments() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uploading = useSelector(
    prescriptionSelectors.selectPrescriptionUploading,
  );
  const uploaded = useSelector(
    prescriptionSelectors.selectPrescriptionUploaded,
  );

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");

  const validateFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Only PDF, JPG, and PNG files are allowed.");
      return false;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File size must be less than ${MAX_SIZE_MB}MB.`);
      return false;
    }
    setError("");
    return true;
  };

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && validateFile(f)) setFile(f);
  };

  const handleUpload = () => {
    if (!file || uploading) return;
    const formData = new FormData();
    formData.append("document", file);
    if (notes) formData.append("notes", notes);
    dispatch(prescriptionSlice.uploadPrescriptionRequest(formData));
  };

  if (uploaded)
    return (
      <Card.Root shadow="md" rounded="2xl" maxW="500px" mx="auto" mt={8}>
        <Card.Body py={12} textAlign="center">
          <Box
            color="teal.500"
            fontSize="6xl"
            display="flex"
            justifyContent="center"
            mb={4}
          >
            <MdCheckCircle />
          </Box>
          <Text fontSize="xl" fontWeight="700" color="teal.600" mb={2}>
            Document Uploaded!
          </Text>
          <Text color="gray.500" fontSize="sm">
            {file?.name}
          </Text>
          <Flex justify="center" gap={3} mt={6}>
            <Button
              variant="outline"
              colorPalette="teal"
              onClick={() => {
                setFile(null);
                setNotes("");
              }}
            >
              Upload Another
            </Button>
            <Button
              colorPalette="teal"
              onClick={() => navigate("/patient/prescriptions")}
            >
              View Prescriptions <MdArrowForward />
            </Button>
          </Flex>
        </Card.Body>
      </Card.Root>
    );

  return (
    <Stack gap={6} w="100%">
      <PageHeader
        title="Upload Documents"
        subtitle="Upload prescriptions, lab reports, or medical records"
        backTo="/patient/prescriptions"
        backLabel="Prescriptions"
      />

      {/* Drop zone */}
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Box
            border="2px dashed"
            borderColor={
              dragOver
                ? "teal.400"
                : error
                  ? "red.300"
                  : file
                    ? "teal.300"
                    : "gray.300"
            }
            bg={dragOver ? "teal.50" : file ? "teal.50" : "gray.50"}
            rounded="xl"
            p={8}
            textAlign="center"
            cursor="pointer"
            transition="all 0.2s"
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
          >
            <Input
              id="file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              display="none"
              onChange={handleFileSelect}
            />

            {file ? (
              <Flex direction="column" align="center" gap={2}>
                <Box color="teal.500" fontSize="3xl">
                  <MdDescription />
                </Box>
                <Text fontWeight="600" color="teal.700">
                  {file.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  colorPalette="red"
                  mt={1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setError("");
                  }}
                >
                  Remove
                </Button>
              </Flex>
            ) : (
              <Flex direction="column" align="center" gap={2}>
                <Box color="gray.400" fontSize="3xl">
                  <MdUploadFile />
                </Box>
                <Text fontWeight="600" color="gray.600">
                  Drag & drop your file here
                </Text>
                <Text fontSize="sm" color="gray.400">
                  or click to browse
                </Text>
                <Text fontSize="xs" color="gray.400" mt={2}>
                  PDF, JPG, PNG — Max {MAX_SIZE_MB}MB
                </Text>
              </Flex>
            )}
          </Box>

          {error && (
            <Text color="red.500" fontSize="sm" mt={3} fontWeight="500">
              {error}
            </Text>
          )}
        </Card.Body>
      </Card.Root>

      {/* Notes */}
      {file && (
        <Card.Root shadow="sm" rounded="xl">
          <Card.Body>
            <Field.Root mb={4}>
              <Field.Label>Notes (optional)</Field.Label>
              <Input
                placeholder="e.g., Lab report from City Hospital, March 2026"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field.Root>

            <Button
              w="full"
              colorPalette="teal"
              size="lg"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <MdUploadFile /> Upload Document
                </>
              )}
            </Button>
          </Card.Body>
        </Card.Root>
      )}
    </Stack>
  );
}
