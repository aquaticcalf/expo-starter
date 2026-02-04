# Icon

Icon wrapper using Octicons from @expo/vector-icons with theme integration.

## api reference

| prop   | type                                      | default | description              |
|--------|-------------------------------------------|---------|--------------------------|
| name   | `OcticonsGlyphs`                          | -       | icon name               |
| size   | `xs` \| `sm` \| `md` \| `lg` \| `xl` \| `number` | `md`   | icon size               |
| color  | `default` \| `muted` \| `subtle` \| `inverse` \| `brand` \| `error` \| `success` \| `warning` \| `info` | `default` | icon color |

## usage

```tsx
import { Icon } from "@/components"

<Icon name="check" size="lg" color="success" />
<Icon name="star-fill" color="warning" />
```
