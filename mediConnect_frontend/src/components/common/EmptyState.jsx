import { Flex, Text, Button, Card, Heading } from "@chakra-ui/react";
import { MdInbox, MdRefresh } from "react-icons/md";

/**
 * Reusable empty-state screen for lists, tables, search results, etc.
 *
 * @param {Object}      props
 * @param {ReactNode}   [props.icon]            - Custom icon element (default: MdInbox).
 * @param {number}      [props.iconSize]        - Icon size in px (default: 36).
 * @param {string}      [props.iconColor]       - Icon colour token (default: 'teal.300').
 * @param {string}      [props.iconBg]          - Icon background colour token (default: 'teal.50').
 * @param {string}      [props.title]           - Bold heading text (default: 'Nothing here yet').
 * @param {string}      [props.description]     - Secondary helper text.
 * @param {string}      [props.search]          - Active search term — renders "no results" copy.
 * @param {string}      [props.searchEmptyText] - Override for search-empty message.
 * @param {string}      [props.actionLabel]     - Primary CTA button text.
 * @param {ReactNode}   [props.actionIcon]      - Icon inside the CTA button.
 * @param {Function}    [props.onAction]        - Called when CTA is clicked.
 * @param {string}      [props.secondaryLabel]  - Secondary button text.
 * @param {Function}    [props.onSecondary]     - Called when secondary button is clicked.
 * @param {boolean}     [props.withCard]        - Wrap in Card.Root (default: true).
 * @param {string|number} [props.py]            - Vertical padding (default: 12).
 * @param {ReactNode}   [props.children]        - Extra content rendered below buttons.
 */
export default function EmptyState({
  icon,
  iconSize = 36,
  iconColor = "teal.300",
  iconBg = "teal.50",
  title = "Nothing here yet",
  description,
  search,
  searchEmptyText,
  actionLabel,
  actionIcon,
  onAction,
  secondaryLabel,
  onSecondary,
  withCard = true,
  py = 12,
  children,
}) {
  const resolvedTitle = search ? "No results found" : title;
  const resolvedDescription = search
    ? searchEmptyText ||
      `No results matching "${search}". Try a different keyword.`
    : description;

  const content = (
    <Flex direction="column" align="center" py={py} gap={3}>
      <Flex
        align="center"
        justify="center"
        bg={iconBg}
        color={iconColor}
        rounded="full"
        w={16}
        h={16}
      >
        {icon || <MdInbox size={iconSize} />}
      </Flex>

      <Heading size="sm" fontWeight="600" color="gray.600">
        {resolvedTitle}
      </Heading>

      {resolvedDescription && (
        <Text fontSize="sm" color="gray.400" textAlign="center" maxW="360px">
          {resolvedDescription}
        </Text>
      )}

      <Flex gap={2} mt={1}>
        {actionLabel && onAction && (
          <Button size="sm" colorPalette="teal" onClick={onAction}>
            {actionIcon} {actionLabel}
          </Button>
        )}
        {secondaryLabel && onSecondary && (
          <Button
            size="sm"
            variant="outline"
            colorPalette="teal"
            onClick={onSecondary}
          >
            {secondaryLabel}
          </Button>
        )}
      </Flex>

      {children}
    </Flex>
  );

  if (!withCard) return content;

  return (
    <Card.Root shadow="sm" rounded="xl">
      <Card.Body>{content}</Card.Body>
    </Card.Root>
  );
}
