# Input

Text input with variants, sizes, and states.

## api reference

| prop         | type                              | default    | description                          |
|--------------|-----------------------------------|------------|--------------------------------------|
| size         | `sm` \| `md` \| `lg`               | `md`       | size of the input                    |
| variant      | `outline` \| `filled` \| `flushed` | `outline`  | visual variant                       |
| label        | `string`                          | -          | input label                          |
| error        | `boolean`                         | `false`    | show error state                     |
| errorMessage | `string`                          | -          | error message text                   |
| disabled     | `boolean`                         | `false`    | disable the input                    |
| leftIcon     | `IconProps["name"]`               | -          | icon on the left                     |
| rightIcon    | `IconProps["name"]`               | -          | icon on the right                    |
| clearable    | `boolean`                         | `false`    | show clear button                    |
| onClear      | `() => void`                      | -          | clear button callback                |
| style        | `TextInputProps["style"]`         | -          | additional styles (highest priority) |

## usage

```tsx
import { Input } from "@/components"

<Input placeholder="Enter text" />
<Input label="Email" variant="filled" error errorMessage="Invalid email" />
```
