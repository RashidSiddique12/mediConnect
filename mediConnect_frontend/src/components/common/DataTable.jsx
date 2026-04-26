import { useState, useMemo } from 'react'
import {
  Box, Flex, Text, Table, Card, Select, Button, Portal,
} from '@chakra-ui/react'
import {
  MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage,
  MdUnfoldMore, MdExpandLess, MdExpandMore, MdInbox,
} from 'react-icons/md'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50]

/**
 * Reusable DataTable with pagination, sorting, and flexible column rendering.
 *
 * @param {Object}   props
 * @param {Array}    props.columns       - Column definitions (see below).
 * @param {Array}    props.data          - Row data array.
 * @param {string}   [props.rowKey]      - Key field used as React key per row (default: '_id').
 * @param {number}   [props.pageSize]    - Initial rows per page (default: 10).
 * @param {boolean}  [props.sortable]    - Enable column sorting (default: true).
 * @param {boolean}  [props.pagination]  - Show pagination controls (default: true).
 * @param {boolean}  [props.striped]     - Striped row backgrounds (default: false).
 * @param {boolean}  [props.hoverable]   - Highlight row on hover (default: true).
 * @param {string}   [props.size]        - Chakra Table size: 'sm' | 'md' | 'lg' (default: 'sm').
 * @param {string}   [props.variant]     - Chakra Table variant (default: 'outline').
 * @param {string}   [props.emptyText]   - Text shown when data is empty.
 * @param {ReactNode}[props.emptyIcon]   - Icon rendered in empty state.
 * @param {Function} [props.onRowClick]  - Called with (row) when a row is clicked.
 * @param {string}   [props.colorPalette]- Accent colour for pagination buttons (default: 'teal').
 *
 * Column definition shape:
 * {
 *   key:        string,                     – unique key & default data accessor
 *   header:     string,                     – column header text
 *   sortable:   boolean,                    – override per-column sorting (default: inherits table)
 *   align:      'left' | 'center' | 'right' – cell alignment (default: 'left')
 *   width:      string | number,            – column width (e.g. '200px', '30%')
 *   render:     (value, row) => ReactNode,  – custom cell renderer
 *   accessor:   (row) => any,               – custom value accessor for sorting / default display
 * }
 */
export default function DataTable({
  columns = [],
  data = [],
  rowKey = '_id',
  pageSize: initialPageSize = 10,
  sortable = true,
  pagination = true,
  striped = false,
  hoverable = true,
  size = 'sm',
  variant = 'outline',
  emptyText = 'No data found',
  emptyIcon,
  onRowClick,
  colorPalette = 'teal',
}) {
  /* ── Sorting state ── */
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  /* ── Pagination state ── */
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(initialPageSize)

  /* ── Sorting logic ── */
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data

    const col = columns.find((c) => c.key === sortConfig.key)
    const accessor = col?.accessor || ((row) => row[col?.key])

    return [...data].sort((a, b) => {
      const aVal = accessor(a)
      const bVal = accessor(b)

      if (aVal == null) return 1
      if (bVal == null) return -1
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      }
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' })
      return sortConfig.direction === 'asc' ? cmp : -cmp
    })
  }, [data, sortConfig, columns])

  /* ── Pagination logic ── */
  const totalRows = sortedData.length
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedData = pagination
    ? sortedData.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage)
    : sortedData

  const startRow = totalRows === 0 ? 0 : (safePage - 1) * rowsPerPage + 1
  const endRow = Math.min(safePage * rowsPerPage, totalRows)

  /* ── Handlers ── */
  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
    setCurrentPage(1)
  }

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))

  const handlePageSizeChange = (value) => {
    setRowsPerPage(Number(value))
    setCurrentPage(1)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <MdUnfoldMore size={14} />
    return sortConfig.direction === 'asc' ? <MdExpandLess size={14} /> : <MdExpandMore size={14} />
  }

  /* ── Render ── */
  if (data.length === 0) {
    return (
      <Card.Root shadow="sm" rounded="xl">
        <Card.Body>
          <Flex direction="column" align="center" py={12} gap={3} color="gray.400">
            {emptyIcon || <MdInbox size={40} />}
            <Text fontWeight="600" color="gray.500">{emptyText}</Text>
          </Flex>
        </Card.Body>
      </Card.Root>
    )
  }

  return (
    <Card.Root shadow="sm" rounded="xl" overflow="hidden">
      <Box overflowX="auto">
        <Table.Root size={size} variant={variant}>
          {/* ── Header ── */}
          <Table.Header>
            <Table.Row bg="gray.50">
              {columns.map((col, idx) => {
                const isFirst = idx === 0
                const isLast = idx === columns.length - 1
                const isSortable = (col.sortable ?? sortable) && col.key
                const align = col.align || 'left'

                return (
                  <Table.ColumnHeader
                    key={col.key}
                    ps={isFirst ? 4 : undefined}
                    pe={isLast ? 4 : undefined}
                    py={3}
                    fontWeight="600"
                    color="gray.600"
                    textAlign={align}
                    width={col.width}
                    cursor={isSortable ? 'pointer' : 'default'}
                    userSelect="none"
                    onClick={isSortable ? () => handleSort(col.key) : undefined}
                    _hover={isSortable ? { color: 'gray.800' } : undefined}
                  >
                    <Flex
                      align="center"
                      gap={1}
                      justify={align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'}
                    >
                      {col.header}
                      {isSortable && (
                        <Box color={sortConfig.key === col.key ? `${colorPalette}.500` : 'gray.400'}>
                          {getSortIcon(col.key)}
                        </Box>
                      )}
                    </Flex>
                  </Table.ColumnHeader>
                )
              })}
            </Table.Row>
          </Table.Header>

          {/* ── Body ── */}
          <Table.Body>
            {paginatedData.map((row, rowIdx) => (
              <Table.Row
                key={row[rowKey] ?? rowIdx}
                bg={striped && rowIdx % 2 === 1 ? 'gray.50' : undefined}
                _hover={hoverable ? { bg: 'gray.50' } : undefined}
                transition="background 0.15s"
                cursor={onRowClick ? 'pointer' : 'default'}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col, colIdx) => {
                  const isFirst = colIdx === 0
                  const isLast = colIdx === columns.length - 1
                  const accessor = col.accessor || ((r) => r[col.key])
                  const cellValue = accessor(row)
                  const align = col.align || 'left'

                  return (
                    <Table.Cell
                      key={col.key}
                      ps={isFirst ? 4 : undefined}
                      pe={isLast ? 4 : undefined}
                      py={3}
                      textAlign={align}
                    >
                      {col.render ? col.render(cellValue, row) : (cellValue ?? '—')}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* ── Pagination footer ── */}
      {pagination && (
        <Flex
          align="center"
          justify="space-between"
          wrap="wrap"
          gap={3}
          px={4}
          py={3}
          borderTop="1px solid"
          borderColor="gray.100"
          bg="gray.50"
        >
          {/* Rows-per-page selector */}
          <Flex align="center" gap={2}>
            <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">Rows per page</Text>
            <Select.Root
              size="xs"
              collection={pageSizeCollection}
              value={[String(rowsPerPage)]}
              onValueChange={(e) => handlePageSizeChange(e.value[0])}
              width="70px"
            >
              <Select.HiddenSelect />
              <Select.Trigger>
                <Select.ValueText />
              </Select.Trigger>
              <Portal>
                <Select.Positioner>
                  <Select.Content minW="70px">
                    {PAGE_SIZE_OPTIONS.map((opt) => (
                      <Select.Item key={opt} item={String(opt)}>
                        {opt}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Flex>

          {/* Row counter */}
          <Text fontSize="xs" color="gray.500">
            {startRow}–{endRow} of {totalRows}
          </Text>

          {/* Page buttons */}
          <Flex gap={1}>
            <Button
              size="xs"
              variant="ghost"
              colorPalette={colorPalette}
              onClick={() => goToPage(1)}
              disabled={safePage <= 1}
              aria-label="First page"
            >
              <MdFirstPage />
            </Button>
            <Button
              size="xs"
              variant="ghost"
              colorPalette={colorPalette}
              onClick={() => goToPage(safePage - 1)}
              disabled={safePage <= 1}
              aria-label="Previous page"
            >
              <MdChevronLeft />
            </Button>

            {/* Page number pills */}
            {getPageNumbers(safePage, totalPages).map((p) =>
              p === '...' ? (
                <Text key={`dots-${Math.random()}`} fontSize="xs" px={1} color="gray.400" alignSelf="center">
                  …
                </Text>
              ) : (
                <Button
                  key={p}
                  size="xs"
                  variant={p === safePage ? 'solid' : 'ghost'}
                  colorPalette={colorPalette}
                  onClick={() => goToPage(p)}
                  minW="28px"
                >
                  {p}
                </Button>
              ),
            )}

            <Button
              size="xs"
              variant="ghost"
              colorPalette={colorPalette}
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage >= totalPages}
              aria-label="Next page"
            >
              <MdChevronRight />
            </Button>
            <Button
              size="xs"
              variant="ghost"
              colorPalette={colorPalette}
              onClick={() => goToPage(totalPages)}
              disabled={safePage >= totalPages}
              aria-label="Last page"
            >
              <MdLastPage />
            </Button>
          </Flex>
        </Flex>
      )}
    </Card.Root>
  )
}

/* ── Helper: collection object for Chakra v3 Select ── */
import { createListCollection } from '@chakra-ui/react'

const pageSizeCollection = createListCollection({
  items: PAGE_SIZE_OPTIONS.map((opt) => ({ label: String(opt), value: String(opt) })),
})

/* ── Helper: compute visible page numbers with ellipsis ── */
function getPageNumbers(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...')
    result.push(sorted[i])
  }
  return result
}
