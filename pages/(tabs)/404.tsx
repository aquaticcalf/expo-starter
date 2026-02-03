import { Flex, Text } from "@/components"

export default function NotFound() {
  return (
    <Flex flex={1} align="center" justify="center" gap={12}>
      <Text variant="headline">404</Text>
      <Text variant="body-large">Page not found</Text>
    </Flex>
  )
}
