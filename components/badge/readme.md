# Badge

Status indicator with color schemes and variants.

## api reference

| prop         | type                                             | default   | description                          |
|--------------|--------------------------------------------------|-----------|--------------------------------------|
| colorScheme  | `brand` \| `success` \| `warning` \| `error` \| `info` \| `neutral` | `brand`   | color scheme for the badge           |
| size         | `sm` \| `md` \| `lg`                             | `md`      | size of the badge                    |
| variant      | `solid` \| `subtle` \| `outline`                | `subtle`  | visual variant                       |
| children     | `ReactNode`                                      | -         | badge content                        |
| style        | `ViewStyle`                                      | -         | additional styles (highest priority) |

## usage

```tsx
import { Badge } from "@/components"

<Badge colorScheme="success" variant="solid">Active</Badge>
<Badge variant="outline" colorScheme="error">Failed</Badge>
```
