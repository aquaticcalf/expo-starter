# Divider

Separator line with orientation and spacing options.

## api reference

| prop         | type                                    | default      | description                     |
|--------------|-----------------------------------------|--------------|---------------------------------|
| orientation  | `horizontal` \| `vertical`             | `horizontal` | divider orientation             |
| color        | `keyof SemanticColors["border"]`        | `muted`      | color of the divider            |
| thickness    | `number`                                | `1`          | thickness in pixels             |
| spacing      | `SpacingToken` \| `number`              | -            | spacing around the divider     |

## usage

```tsx
import { Divider } from "@/components"

<Divider />
<Divider orientation="vertical" thickness={2} />
```
