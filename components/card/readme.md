# Card

Surface container with variants for elevated, outlined, and filled styles.

## api reference

| prop      | type                              | default    | description                          |
|-----------|-----------------------------------|------------|--------------------------------------|
| variant   | `elevated` \| `outlined` \| `filled` | `elevated` | visual variant                       |
| p         | `SpacingToken` \| `number`        | `4`        | padding (all sides)                  |
| px        | `SpacingToken` \| `number`        | -          | padding horizontal                   |
| py        | `SpacingToken` \| `number`        | -          | padding vertical                     |
| radius        | `RadiusToken`                     | `lg`       | border radius                                |
| children      | `ReactNode`                       | -          | card content                                 |
| style         | `ViewStyle`                       | -          | additional styles (highest priority) |

## usage

```tsx
import { Card } from "@/components"

<Card variant="outlined">
  card content
</Card>
```
