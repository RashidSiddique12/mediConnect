import { NavLink } from "react-router-dom";
import { Box, Stack, Text, Flex, Image } from "@chakra-ui/react";
import {
  MdDashboard,
  MdLocalHospital,
  MdPeople,
  MdStar,
  MdMedicalServices,
  MdPerson,
  MdCalendarToday,
  MdEventNote,
  MdDescription,
  MdSearch,
  MdFavorite,
  MdAssignment,
  MdSchedule,
} from "react-icons/md";
import { FaHospitalUser } from "react-icons/fa";

const NAV_CONFIG = {
  admin: [
    { label: "Dashboard", to: "/admin", icon: MdDashboard },
    { label: "Hospitals", to: "/admin/hospitals", icon: MdLocalHospital },
    { label: "Users", to: "/admin/users", icon: MdPeople },
    { label: "Specialties", to: "/admin/specialties", icon: MdMedicalServices },
    { label: "Reviews", to: "/admin/reviews", icon: MdStar },
  ],
  hospital: [
    { label: "Dashboard", to: "/hospital", icon: MdDashboard },
    { label: "Profile", to: "/hospital/profile", icon: MdLocalHospital },
    { label: "Doctors", to: "/hospital/doctors", icon: MdPerson },
    { label: "Schedules", to: "/hospital/schedules", icon: MdSchedule },
    { label: "Appointments", to: "/hospital/appointments", icon: MdEventNote },
  ],
  patient: [
    { label: "Home", to: "/patient", icon: MdDashboard },
    { label: "Profile", to: "/patient/profile", icon: MdPerson },
    { label: "Hospitals", to: "/patient/hospitals", icon: MdLocalHospital },
    { label: "Find Doctors", to: "/patient/doctors", icon: MdSearch },
    {
      label: "Appointments",
      to: "/patient/appointments",
      icon: MdCalendarToday,
    },
    {
      label: "Prescriptions",
      to: "/patient/prescriptions",
      icon: MdDescription,
    },
  ],
};

const ROLE_LABELS = {
  admin: "Super Admin",
  hospital: "Hospital Admin",
  patient: "Patient Portal",
};

export default function Sidebar({ role = "patient" }) {
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.patient;

  return (
    <Box
      as="nav"
      w="230px"
      h="100vh"
      bg="brand.700"
      overflowY="auto"
      px={3}
      py={5}
      flexShrink={0}
      display="flex"
      flexDirection="column"
    >
      {/* Logo / Brand */}
      <Flex align="center" gap={2} px={3} mb={6}>
        <Box color="brand.300" fontSize="2xl">
          <FaHospitalUser />
        </Box>
        <Box>
          <Text color="white" fontWeight="bold" fontSize="md" lineHeight="1.2">
            MediConnect
          </Text>
          <Text
            color="brand.300"
            fontSize="10px"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {ROLE_LABELS[role]}
          </Text>
        </Box>
      </Flex>

      {/* Nav Links */}
      <Stack gap={1} flex={1}>
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split("/").length <= 2}
            style={({ isActive }) => ({
              textDecoration: "none",
              borderRadius: "8px",
              display: "block",
              padding: "9px 12px",
              background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
              color: isActive ? "white" : "rgba(255,255,255,0.7)",
              fontWeight: isActive ? "600" : "400",
              transition: "all 0.15s",
              borderLeft: isActive
                ? "3px solid #4dc9c9"
                : "3px solid transparent",
            })}
          >
            <Flex align="center" gap={3}>
              <Icon size={18} />
              <Text fontSize="sm">{label}</Text>
            </Flex>
          </NavLink>
        ))}
      </Stack>

      {/* Footer */}
      <Text color="brand.400" fontSize="10px" textAlign="center" px={3} mt={4}>
        © 2026 MediConnect
      </Text>
    </Box>
  );
}
