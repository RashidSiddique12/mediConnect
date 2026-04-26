import { Flex, Text, Button, Card, Heading, Code } from '@chakra-ui/react'
import {
  MdErrorOutline,
  MdWifiOff,
  MdBlock,
  MdSearchOff,
  MdCloudOff,
  MdRefresh,
  MdHome,
} from 'react-icons/md'

const ERROR_PRESETS = {
  generic: {
    icon: <MdErrorOutline size={36} />,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again later.',
    iconColor: 'red.400',
    iconBg: 'red.50',
  },
  network: {
    icon: <MdWifiOff size={36} />,
    title: 'Connection lost',
    description: 'Please check your internet connection and try again.',
    iconColor: 'orange.400',
    iconBg: 'orange.50',
  },
  notFound: {
    icon: <MdSearchOff size={36} />,
    title: 'Not found',
    description: 'The resource you are looking for does not exist or has been removed.',
    iconColor: 'gray.400',
    iconBg: 'gray.100',
  },
  forbidden: {
    icon: <MdBlock size={36} />,
    title: 'Access denied',
    description: 'You do not have permission to view this resource.',
    iconColor: 'red.400',
    iconBg: 'red.50',
  },
  server: {
    icon: <MdCloudOff size={36} />,
    title: 'Server error',
    description: 'Our servers are having trouble right now. Please try again shortly.',
    iconColor: 'orange.400',
    iconBg: 'orange.50',
  },
}

/**
 * Reusable error-state screen for failed API calls, 404s, permission issues, etc.
 *
 * @param {Object}      props
 * @param {'generic'|'network'|'notFound'|'forbidden'|'server'} [props.preset]
 *        - Quick preset that sets icon, title, description, and colours.
 *          Any explicit prop will override the preset value.
 * @param {ReactNode}   [props.icon]            - Custom icon element.
 * @param {number}      [props.iconSize]        - Icon size in px (default: 36).
 * @param {string}      [props.iconColor]       - Icon colour token (default: 'red.400').
 * @param {string}      [props.iconBg]          - Icon background token (default: 'red.50').
 * @param {string}      [props.title]           - Bold heading.
 * @param {string}      [props.description]     - Helper / explanation text.
 * @param {string}      [props.errorMessage]    - Raw error string (shown in a Code block).
 * @param {number}      [props.statusCode]      - HTTP status code (displayed beside title).
 * @param {string}      [props.retryLabel]      - Retry button text (default: 'Try Again').
 * @param {Function}    [props.onRetry]         - Called when retry is clicked.
 * @param {string}      [props.homeLabel]       - "Go home" button text (default: 'Go Home').
 * @param {Function}    [props.onHome]          - Called when home button is clicked.
 * @param {string}      [props.actionLabel]     - Custom extra action text.
 * @param {Function}    [props.onAction]        - Called when custom action is clicked.
 * @param {boolean}     [props.withCard]        - Wrap in Card.Root (default: true).
 * @param {boolean}     [props.fullScreen]      - Centre vertically in viewport (default: false).
 * @param {string|number} [props.py]            - Vertical padding (default: 12).
 * @param {ReactNode}   [props.children]        - Extra content below buttons.
 */
export default function ErrorState({
  preset = 'generic',
  icon,
  iconSize = 36,
  iconColor,
  iconBg,
  title,
  description,
  errorMessage,
  statusCode,
  retryLabel = 'Try Again',
  onRetry,
  homeLabel = 'Go Home',
  onHome,
  actionLabel,
  onAction,
  withCard = true,
  fullScreen = false,
  py = 12,
  children,
}) {
  const base = ERROR_PRESETS[preset] || ERROR_PRESETS.generic

  const resolvedIcon = icon || base.icon
  const resolvedIconColor = iconColor || base.iconColor
  const resolvedIconBg = iconBg || base.iconBg
  const resolvedTitle = title || base.title
  const resolvedDescription = description || base.description

  const content = (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={py}
      gap={3}
      {...(fullScreen && { minH: '100vh', px: 6 })}
    >
      <Flex
        align="center"
        justify="center"
        bg={resolvedIconBg}
        color={resolvedIconColor}
        rounded="full"
        w={16}
        h={16}
      >
        {resolvedIcon}
      </Flex>

      <Flex align="center" gap={2}>
        {statusCode && (
          <Text fontSize="lg" fontWeight="bold" color={resolvedIconColor}>
            {statusCode}
          </Text>
        )}
        <Heading size="sm" fontWeight="600" color="gray.600">
          {resolvedTitle}
        </Heading>
      </Flex>

      {resolvedDescription && (
        <Text fontSize="sm" color="gray.400" textAlign="center" maxW="400px">
          {resolvedDescription}
        </Text>
      )}

      {errorMessage && (
        <Code
          fontSize="xs"
          colorPalette="red"
          px={3}
          py={1}
          rounded="md"
          maxW="480px"
          textAlign="center"
          wordBreak="break-word"
        >
          {errorMessage}
        </Code>
      )}

      <Flex gap={2} mt={1} wrap="wrap" justify="center">
        {onRetry && (
          <Button size="sm" colorPalette="teal" onClick={onRetry}>
            <MdRefresh /> {retryLabel}
          </Button>
        )}
        {onHome && (
          <Button size="sm" variant="outline" colorPalette="teal" onClick={onHome}>
            <MdHome /> {homeLabel}
          </Button>
        )}
        {actionLabel && onAction && (
          <Button size="sm" variant="ghost" colorPalette="teal" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Flex>

      {children}
    </Flex>
  )

  if (fullScreen || !withCard) return content

  return (
    <Card.Root shadow="sm" rounded="xl">
      <Card.Body>{content}</Card.Body>
    </Card.Root>
  )
}
