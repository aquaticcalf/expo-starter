# Text

Typography primitive with semantic variants and theme integration.

## api reference

| prop      | type                                                                                                                                       | default   | description                          |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------|-----------|--------------------------------------|
| variant   | `body` \| `body-small` \| `body-large` \| `label` \| `label-small` \| `label-large` \| `title` \| `title-small` \| `title-large` \| `headline` \| `caption` | `body`    | text variant                         |
| color     | `default` \| `muted` \| `subtle` \| `inverse` \| `brand` \| `error` \| `success` \| `warning` \| `info`                                 | `default` | text color                           |
| weight    | `thin` \| `light` \| `normal` \| `medium` \| `semibold` \| `bold` \| `black`                                                               | -         | font weight                          |
| align     | `left` \| `center` \| `right`                                                                                                            | -         | text alignment                       |
| children  | `ReactNode`                                                                                                                               | -         | text content                         |
| style     | `RNTextProps["style"]`                                                                                                                    | -         | additional styles (highest priority)  |

## usage

```tsx
import { Text } from "@/components"

<Text variant="title" color="brand">Hello</Text>
<Text variant="body" weight="medium">Body text</Text>
```
