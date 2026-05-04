import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Stack } from "@chakra-ui/react";
import PageHeader from "@/components/common/PageHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import DoctorForm from "./components/DoctorForm";
import * as doctorSlice from "@/features/doctors/doctorSlice";
import {
  selectCurrentDoctor,
  selectDoctorsLoading,
  selectDoctorsSaving,
  selectDoctorsError,
} from "@/features/doctors/doctorSelectors";

export default function EditDoctor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const doctor = useSelector(selectCurrentDoctor);
  const loading = useSelector(selectDoctorsLoading);
  const saving = useSelector(selectDoctorsSaving);
  const error = useSelector(selectDoctorsError);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(doctorSlice.fetchDoctorByIdRequest(id));
    return () => dispatch(doctorSlice.clearCurrentDoctor());
  }, [dispatch, id]);

  const handleSubmit = (payload) => {
    dispatch(doctorSlice.updateDoctorRequest({ id, ...payload }));
    setSaved(true);
    setTimeout(() => navigate("/hospital/doctors"), 1200);
  };

  if (loading) return <Loader />;

  if (!doctor && !loading) {
    return (
      <EmptyState
        title="Doctor not found"
        description="The doctor you're looking for doesn't exist or has been removed"
        actionLabel="Back to Doctors"
        onAction={() => navigate("/hospital/doctors")}
      />
    );
  }

  return (
    <Stack gap={6}>
      <PageHeader
        title="Edit Doctor"
        subtitle={`Update information for ${doctor?.name}`}
        backTo="/hospital/doctors"
      />
      <DoctorForm
        mode="edit"
        doctor={doctor}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        saved={saved}
      />
    </Stack>
  );
}
