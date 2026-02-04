# Button

Interactive button with variants, sizes, and color schemes.

## api reference

| prop         | type                                             | default   | description                          |
|--------------|--------------------------------------------------|-----------|--------------------------------------|
| variant      | `solid` \| `subtle` \| `outline` \| `ghost`    | `solid`   | visual variant                       |
| size         | `sm` \| `md` \| `lg`                             | `md`      | size of the button                   |
| colorScheme  | `brand` \| `success` \| `warning` \| `error` \| `info` \| `neutral` | `brand`   | color scheme                         |
| loading      | `boolean`                                        | `false`   | show loading spinner                 |
| disabled     | `boolean`                                        | `false`   | disable the button                   |
| leftIcon     | `IconProps["name"]`                              | -         | icon on the left                     |
| rightIcon    | `IconProps["name"]`                              | -         | icon on the right                    |
| children     | `ReactNode`                                      | -         | button content                       |
| style        | `ViewStyle`                                      | -         | additional styles (highest priority)  |

## usage

```tsx
import { Button } from "@/components"

<Button onPress={() => alert("pressed")}>Click me</Button>
<Button variant="outline" colorScheme="success">Success</Button>
```
