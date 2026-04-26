import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Stack, Flex, Button, Field, Input, Textarea,
  Card, Grid, Select, createListCollection,
} from '@chakra-ui/react'
import { MdPerson } from 'react-icons/md'
import * as specialtySlice from '@/features/specialties/specialtySlice'
import { selectSpecialties } from '@/features/specialties/specialtySelectors'

const GENDER_COLLECTION = createListCollection({
  items: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ],
})

const INITIAL_FORM = {
  name: '',
  specialtyIds: '',
  experience: '',
  consultationFee: '',
  qualification: '',
  bio: '',
  gender: '',
}

/**
 * Shared doctor form for create and edit flows.
 *
 * @param {'create' | 'edit'} mode      - Form mode.
 * @param {Object}            [doctor]  - Existing doctor data (edit mode).
 * @param {Function}          onSubmit  - Called with the prepared payload.
 * @param {boolean}           [saving]  - Loading state for submit button.
 * @param {string}            [error]   - Error message to display.
 * @param {boolean}           [saved]   - Success state to display.
 */
export default function DoctorForm({
  mode = 'create',
  doctor,
  onSubmit,
  saving,
  error,
  saved,
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const specialties = useSelector(selectSpecialties)

  const [form, setForm] = useState(INITIAL_FORM)

  useEffect(() => {
    dispatch(specialtySlice.fetchSpecialtiesRequest())
  }, [dispatch])

  useEffect(() => {
    if (mode === 'edit' && doctor) {
      setForm({
        name: doctor.name || '',
        specialtyIds: doctor.specialtyIds?.[0]?._id || doctor.specialtyIds?.[0] || '',
        experience: doctor.experience || '',
        consultationFee: doctor.consultationFee || '',
        qualification: doctor.qualification || '',
        bio: doctor.bio || '',
        gender: doctor.gender || '',
      })
    }
  }, [doctor, mode])

  const specialtyCollection = createListCollection({
    items: specialties.map((s) => ({ label: s.name, value: s._id })),
  })

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      specialtyIds: form.specialtyIds ? [form.specialtyIds] : [],
      experience: Number(form.experience),
      consultationFee: Number(form.consultationFee),
    })
  }

  const isEdit = mode === 'edit'

  return (
    <Stack gap={5}>
      {saved && !error && (
        <Box bg="teal.50" border="1px solid" borderColor="teal.200" p={4} rounded="lg">
          <Flex align="center" gap={2}>
            <Box
              w={5}
              h={5}
              bg="teal.500"
              color="white"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="700"
              flexShrink={0}
            >
              ✓
            </Box>
            <Box fontSize="sm" fontWeight="600" color="teal.700">
              {isEdit ? 'Changes saved!' : 'Doctor added successfully!'} Redirecting…
            </Box>
          </Flex>
        </Box>
      )}

      {error && (
        <Box bg="red.50" border="1px solid" borderColor="red.200" p={4} rounded="lg">
          <Box fontSize="sm" fontWeight="600" color="red.700">
            {error}
          </Box>
        </Box>
      )}

      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack gap={5}>
              {mode === 'create' && (
                <Flex align="center" gap={2} pb={2} borderBottomWidth="1px">
                  <Box color="teal.500">
                    <MdPerson size={20} />
                  </Box>
                  <Box fontSize="md" fontWeight="600" color="teal.700">
                    Personal Information
                  </Box>
                </Flex>
              )}

              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                <Field.Root required>
                  <Field.Label>Full Name</Field.Label>
                  <Input
                    name="name"
                    placeholder="Dr. Jane Smith"
                    value={form.name}
                    onChange={handleChange}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Specialty</Field.Label>
                  <Select.Root
                    collection={specialtyCollection}
                    value={form.specialtyIds ? [form.specialtyIds] : []}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, specialtyIds: v.value[0] || '' }))
                    }
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select specialty" />
                    </Select.Trigger>
                    <Select.Content>
                      {specialtyCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Experience (years)</Field.Label>
                  <Input
                    name="experience"
                    type="number"
                    min="0"
                    placeholder="5"
                    value={form.experience}
                    onChange={handleChange}
                  />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Consultation Fee ($)</Field.Label>
                  <Input
                    name="consultationFee"
                    type="number"
                    min="0"
                    placeholder="120"
                    value={form.consultationFee}
                    onChange={handleChange}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Qualification</Field.Label>
                  <Input
                    name="qualification"
                    placeholder="MBBS, MD Cardiology"
                    value={form.qualification}
                    onChange={handleChange}
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Gender</Field.Label>
                  <Select.Root
                    collection={GENDER_COLLECTION}
                    value={form.gender ? [form.gender] : []}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, gender: v.value[0] || '' }))
                    }
                  >
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select gender" />
                    </Select.Trigger>
                    <Select.Content>
                      {GENDER_COLLECTION.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field.Root>
              </Grid>

              <Field.Root>
                <Field.Label>Bio / Description</Field.Label>
                <Textarea
                  name="bio"
                  placeholder="Brief professional bio…"
                  rows={3}
                  value={form.bio}
                  onChange={handleChange}
                />
              </Field.Root>

              <Flex gap={3} justify="flex-end">
                <Button
                  variant="outline"
                  onClick={() => navigate('/hospital/doctors')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorPalette="teal"
                  loading={saving}
                  loadingText={isEdit ? 'Saving…' : 'Adding…'}
                >
                  {isEdit ? 'Save Changes' : 'Add Doctor'}
                </Button>
              </Flex>
            </Stack>
          </Box>
        </Card.Body>
      </Card.Root>
    </Stack>
  )
}
