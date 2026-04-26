import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Stack } from '@chakra-ui/react'
import PageHeader from '@/components/common/PageHeader'
import DoctorForm from './components/DoctorForm'
import * as doctorSlice from '@/features/doctors/doctorSlice'
import { selectDoctorsSaving, selectDoctorsError } from '@/features/doctors/doctorSelectors'

export default function AddDoctor() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const saving = useSelector(selectDoctorsSaving)
  const error = useSelector(selectDoctorsError)
  const [saved, setSaved] = useState(false)

  const handleSubmit = (payload) => {
    dispatch(doctorSlice.createDoctorRequest(payload))
    setSaved(true)
    setTimeout(() => navigate('/hospital/doctors'), 1200)
  }

  return (
    <Stack gap={6} maxW="700px">
      <PageHeader
        title="Add Doctor"
        subtitle="Register a new doctor at your hospital"
        backTo="/hospital/doctors"
      />
      <DoctorForm
        mode="create"
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        saved={saved}
      />
    </Stack>
  )
}
