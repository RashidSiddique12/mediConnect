import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react'
import { MdArrowBack } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

/**
 * Reusable page header with title, subtitle, back navigation, and action buttons.
 *
 * @param {string}      title       - Page heading text.
 * @param {string}      [subtitle]  - Secondary description text.
 * @param {string}      [backTo]    - Path for back navigation button.
 * @param {string}      [backLabel] - Label for back button (default: 'Back').
 * @param {ReactNode[]} [actions]   - Array of action button elements rendered on the right.
 * @param {ReactNode}   [children]  - Extra content rendered below the header row.
 */
export default function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  actions,
  children,
}) {
  const navigate = useNavigate()

  return (
    <Flex
      align={{ base: 'flex-start', sm: 'center' }}
      justify="space-between"
      wrap="wrap"
      gap={3}
    >
      <Flex align="center" gap={3}>
        {backTo && (
          <Button
            variant="ghost"
            colorPalette="teal"
            size="sm"
            onClick={() => navigate(backTo)}
          >
            <MdArrowBack /> {backLabel}
          </Button>
        )}
        <Box>
          <Heading size="lg" color="gray.800">
            {title}
          </Heading>
          {subtitle && (
            <Text color="gray.500" fontSize="sm" mt={0.5}>
              {subtitle}
            </Text>
          )}
        </Box>
      </Flex>

      {actions && <Flex gap={2}>{actions}</Flex>}
      {children}
    </Flex>
  )
}
