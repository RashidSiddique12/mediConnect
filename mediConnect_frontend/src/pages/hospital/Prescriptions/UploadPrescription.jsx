import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Text, Flex, Button, Card, Field, Input, Textarea,
} from '@chakra-ui/react'
import { MdUpload, MdCloudUpload, MdInsertDriveFile } from 'react-icons/md'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import * as appointmentSlice from '@/features/appointments/appointmentSlice'
import { selectCurrentAppointment } from '@/features/appointments/appointmentSelectors'
import * as prescriptionSlice from '@/features/prescriptions/prescriptionSlice'
import { selectPrescriptionUploading, selectPrescriptionUploaded } from '@/features/prescriptions/prescriptionSelectors'

const ACCEPTED_FORMATS = '.pdf,.jpg,.jpeg,.png'

export default function UploadPrescription() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const appointment = useSelector(selectCurrentAppointment)
  const uploading = useSelector(selectPrescriptionUploading)
  const uploaded = useSelector(selectPrescriptionUploaded)
  const fileRef = useRef(null)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    dispatch(appointmentSlice.fetchAppointmentByIdRequest(appointmentId))
    return () => dispatch(prescriptionSlice.resetUpload())
  }, [dispatch, appointmentId])

  useEffect(() => {
    if (uploaded) {
      const timer = setTimeout(() => navigate(`/hospital/appointments/${appointmentId}`), 1500)
      return () => clearTimeout(timer)
    }
  }, [uploaded, navigate, appointmentId])

  const handleFileChange = (e) => {
    setFileName(e.target.files?.[0]?.name || '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.set('appointmentId', appointmentId)
    dispatch(prescriptionSlice.uploadPrescriptionRequest(formData))
  }

  if (!appointment) {
    return (
      <EmptyState
        title="Appointment not found"
        actionLabel="Back to Appointments"
        onAction={() => navigate('/hospital/appointments')}
      />
    )
  }

  const backPath = `/hospital/appointments/${appointmentId}`

  return (
    <Stack gap={6} maxW="700px">
      <PageHeader
        title="Upload Prescription"
        subtitle={`For: ${appointment.patientId?.name || 'Patient'} | ${appointment.doctorId?.name || 'Doctor'}`}
        backTo={backPath}
      />

      {uploaded && (
        <Box bg="teal.50" border="1px solid" borderColor="teal.200" p={4} rounded="lg">
          <Flex align="center" gap={2}>
            <Box
              w={5} h={5} bg="teal.500" color="white" rounded="full"
              display="flex" alignItems="center" justifyContent="center"
              fontSize="xs" fontWeight="700" flexShrink={0}
            >
              ✓
            </Box>
            <Text fontSize="sm" fontWeight="600" color="teal.700">
              Prescription uploaded successfully! Redirecting…
            </Text>
          </Flex>
        </Box>
      )}

      <Card.Root shadow="sm" rounded="xl">
        <Card.Body as="form" onSubmit={handleSubmit}>
          <Stack gap={5}>
            <Field.Root required>
              <Field.Label>Prescription File</Field.Label>
              <Box
                border="2px dashed"
                borderColor={fileName ? 'teal.300' : 'gray.200'}
                rounded="lg"
                p={6}
                textAlign="center"
                cursor="pointer"
                _hover={{ borderColor: 'teal.400', bg: 'teal.50' }}
                transition="all 0.15s"
                onClick={() => fileRef.current?.click()}
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
                    <Box color="teal.500"><MdInsertDriveFile size={32} /></Box>
                    <Text fontSize="sm" fontWeight="600" color="teal.700">{fileName}</Text>
                    <Text fontSize="xs" color="gray.500">Click to change file</Text>
                  </Flex>
                ) : (
                  <Flex direction="column" align="center" gap={2}>
                    <Box color="gray.300"><MdCloudUpload size={40} /></Box>
                    <Text fontSize="sm" fontWeight="600" color="gray.600">
                      Click to select a file
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      Accepted formats: PDF, JPG, PNG
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
              />
            </Field.Root>

            <Flex gap={3} justify="flex-end">
              <Button variant="outline" onClick={() => navigate(backPath)}>Cancel</Button>
              <Button type="submit" colorPalette="teal" loading={uploading} loadingText="Uploading…">
                <MdUpload /> Upload Prescription
              </Button>
            </Flex>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
