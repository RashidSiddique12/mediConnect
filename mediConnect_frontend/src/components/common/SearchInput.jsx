import { Box, Input } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";

/**
 * Search input with a built-in search icon.
 *
 * @param {string}   value        - Current search text.
 * @param {Function} onChange     - Called with the new search string.
 * @param {string}   [placeholder] - Input placeholder text.
 * @param {string}   [maxW]       - Max width of the wrapper (default: '400px').
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  maxW = "400px",
  ...rest
}) {
  return (
    <Box position="relative" maxW={maxW} w="full" {...rest}>
      <Box
        position="absolute"
        left={3}
        top="50%"
        transform="translateY(-50%)"
        color="gray.400"
        zIndex={1}
        pointerEvents="none"
      >
        <MdSearch size={18} />
      </Box>
      <Input
        pl={9}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Box>
  );
}
