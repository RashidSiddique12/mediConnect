
import { Component } from 'react'
import { Box, Heading, Text, Button } from '@chakra-ui/react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // In production, pipe this to a logging service (e.g., Sentry).
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={4}
          p={8}
        >
          <Heading color="red.500">Something went wrong</Heading>
          <Text color="gray.500" textAlign="center" maxW="md">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Text>
          <Button colorPalette="blue" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}
