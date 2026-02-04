# Avatar

User image display with fallback initials and status indicator.

## api reference

| prop      | type                     | default | description                                      |
|-----------|--------------------------|---------|--------------------------------------------------|
| size      | `xs` \| `sm` \| `md` \| `lg` \| `xl` | `md`    | size of the avatar                               |
| src       | `string`                 | -       | image uri to display                             |
| fallback  | `string`                 | -       | fallback initials to show when no image          |
| status    | `online` \| `offline` \| `busy` \| `away` | -       | status indicator color                           |
| style     | `ViewStyle`              | -       | additional styles (highest priority)              |

## usage

```tsx
import { Avatar } from "@/components"

<Avatar src="https://example.com/user.jpg" size="lg" />
<Avatar fallback="John Doe" status="online" />
```
