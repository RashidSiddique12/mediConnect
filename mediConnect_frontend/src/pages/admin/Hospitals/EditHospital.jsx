import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Button, Spinner, Center,
} from '@chakra-ui/react'
import { MdLocalHospital, MdSave, MdArrowBack } from 'react-icons/md'
import * as hospitalSlice from '@/features/hospitals/hospitalSlice'
import * as hospitalSelectors from '@/features/hospitals/hospitalSelectors'
import * as specialtySlice from '@/features/specialties/specialtySlice'
import * as specialtySelectors from '@/features/specialties/specialtySelectors'
import HospitalForm from './componets/HospitalForm'

export default function EditHospital() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const hospital = useSelector(hospitalSelectors.selectCurrentHospital)
  const loading = useSelector(hospitalSelectors.selectHospitalsLoading)
  const specialties = useSelector(specialtySelectors.selectSpecialties)

  const [form, setForm] = useState(null)

  useEffect(() => {
    dispatch(hospitalSlice.fetchHospitalByIdRequest(id))
    dispatch(specialtySlice.fetchSpecialtiesRequest())
  }, [dispatch, id])

  useEffect(() => {
    if (hospital && hospital._id === id) {
      setForm({
        name: hospital.name || '',
        type: hospital.type || 'general',
        registrationNumber: hospital.registrationNumber || '',
        website: hospital.website || '',
        description: hospital.description || '',
        city: hospital.address?.city || '',
        state: hospital.address?.state || '',
        street: hospital.address?.street || '',
        zipCode: hospital.address?.zipCode || '',
        phone: hospital.phone || '',
        email: hospital.email || '',
        emergencyContact: hospital.emergencyContact || '',
        is24x7: hospital.operatingHours?.is24x7 || false,
        openTime: hospital.operatingHours?.open || '08:00',
        closeTime: hospital.operatingHours?.close || '20:00',
        specialties: (hospital.specialties || []).map((s) => s._id || s),
        facilities: hospital.facilities || [],
        insurancePanels: (hospital.insurancePanels || []).join(', '),
      })
    }
  }, [hospital, id])

  const handleSave = () => {
    const insuranceArr = form.insurancePanels.split(',').map((s) => s.trim()).filter(Boolean)
    dispatch(
      hospitalSlice.editHospitalRequest({
        id,
        name: form.name,
        type: form.type,
        registrationNumber: form.registrationNumber,
        website: form.website,
        description: form.description,
        address: { city: form.city, state: form.state, street: form.street, zipCode: form.zipCode },
        phone: form.phone,
        email: form.email,
        emergencyContact: form.emergencyContact,
        operatingHours: {
          is24x7: form.is24x7,
          open: form.is24x7 ? '' : form.openTime,
          close: form.is24x7 ? '' : form.closeTime,
        },
        specialties: form.specialties,
        facilities: form.facilities,
        insurancePanels: insuranceArr,
      }),
    )
    navigate(`/admin/hospitals/${id}`)
  }

  if (loading || !form) {
    return <Center py={16}><Spinner size="xl" color="teal.500" /></Center>
  }

  const canSave = form.name.trim() && form.city.trim() && form.phone.trim() && form.email.trim()

  return (
    <Stack gap={6}>
      {/* ── Header ── */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Flex align="center" gap={3}>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <MdArrowBack />
          </Button>
          <Flex align="center" justify="center" color="teal.500" bg="teal.50" p={2.5} rounded="xl">
            <MdLocalHospital size={22} />
          </Flex>
          <Box>
            <Heading size="lg">Edit Hospital</Heading>
            <Text color="gray.500" fontSize="sm">{hospital?.name}</Text>
          </Box>
        </Flex>
        <Flex gap={2}>
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button colorPalette="teal" onClick={handleSave} disabled={!canSave}>
            <MdSave /> Save Changes
          </Button>
        </Flex>
      </Flex>

      {/* ── Shared form ── */}
      <HospitalForm form={form} setForm={setForm} specialties={specialties} mode="edit" />

      {/* ── Bottom save bar ── */}
      <Flex justify="flex-end" gap={2} pb={4}>
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button colorPalette="teal" onClick={handleSave} disabled={!canSave}>
          <MdSave /> Save Changes
        </Button>
      </Flex>
    </Stack>
  )
}
