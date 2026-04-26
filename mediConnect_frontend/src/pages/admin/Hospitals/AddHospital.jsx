import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Heading, Text, Flex, Button, Spinner, Center,
} from '@chakra-ui/react'
import { MdLocalHospital, MdAdd, MdArrowBack } from 'react-icons/md'
import * as hospitalSlice from '@/features/hospitals/hospitalSlice'
import * as specialtySlice from '@/features/specialties/specialtySlice'
import * as specialtySelectors from '@/features/specialties/specialtySelectors'
import HospitalForm from './componets/HospitalForm'
import { INITIAL_FORM } from './componets/constants'

export default function AddHospital() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const specialties = useSelector(specialtySelectors.selectSpecialties)
  const loading = useSelector(specialtySelectors.selectSpecialtiesLoading)

  const [form, setForm] = useState(INITIAL_FORM)

  useEffect(() => {
    dispatch(specialtySlice.fetchSpecialtiesRequest())
  }, [dispatch])

  const canSubmit =
    form.name.trim() &&
    form.city.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    form.adminName.trim() &&
    form.adminEmail.trim() &&
    form.adminPassword.length >= 6

  const handleSubmit = () => {
    const insuranceArr = form.insurancePanels.split(',').map((s) => s.trim()).filter(Boolean)
    dispatch(
      hospitalSlice.addHospitalRequest({
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
        admin: {
          name: form.adminName,
          email: form.adminEmail,
          phone: form.adminPhone,
          password: form.adminPassword,
        },
      }),
    )
    navigate('/admin/hospitals')
  }

  if (loading) {
    return <Center py={16}><Spinner size="xl" color="teal.500" /></Center>
  }

  return (
    <Stack gap={6}>
      {/* ── Header ── */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Flex align="center" gap={3}>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/hospitals')}>
            <MdArrowBack />
          </Button>
          <Flex align="center" justify="center" color="teal.500" bg="teal.50" p={2.5} rounded="xl">
            <MdLocalHospital size={22} />
          </Flex>
          <Box>
            <Heading size="lg">Add Hospital</Heading>
            <Text color="gray.500" fontSize="sm">Register a new healthcare facility</Text>
          </Box>
        </Flex>
        <Flex gap={2}>
          <Button variant="outline" onClick={() => navigate('/admin/hospitals')}>Cancel</Button>
          <Button colorPalette="teal" onClick={handleSubmit} disabled={!canSubmit}>
            <MdAdd /> Create Hospital
          </Button>
        </Flex>
      </Flex>

      {/* ── Shared form ── */}
      <HospitalForm form={form} setForm={setForm} specialties={specialties} mode="create" />

      {/* ── Bottom action bar ── */}
      <Flex justify="flex-end" gap={2} pb={4}>
        <Button variant="outline" onClick={() => navigate('/admin/hospitals')}>Cancel</Button>
        <Button colorPalette="teal" onClick={handleSubmit} disabled={!canSubmit}>
          <MdAdd /> Create Hospital
        </Button>
      </Flex>
    </Stack>
  )
}
