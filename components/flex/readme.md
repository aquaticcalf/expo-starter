# Flex

Flexbox layout primitive with direction, alignment, and distribution controls.

## api reference

| prop          | type                              | default    | description                          |
|---------------|-----------------------------------|------------|--------------------------------------|
| direction     | `row` \| `column` \| `row-reverse` \| `column-reverse` | `column`   | flex direction                       |
| align         | `start` \| `center` \| `end` \| `stretch` \| `baseline` | -          | align items                          |
| justify       | `start` \| `center` \| `end` \| `between` \| `around` \| `evenly` | -          | justify content                      |
| wrap          | `wrap` \| `nowrap` \| `wrap-reverse` | -          | flex wrap                            |
| p             | `SpacingToken` \| `number`        | -          | padding (all sides)                  |
| px            | `SpacingToken` \| `number`        | -          | padding horizontal                   |
| py            | `SpacingToken` \| `number`        | -          | padding vertical                     |
| pt            | `SpacingToken` \| `number`        | -          | padding top                          |
| pb            | `SpacingToken` \| `number`        | -          | padding bottom                       |
| pl            | `SpacingToken` \| `number`        | -          | padding left                         |
| pr            | `SpacingToken` \| `number`        | -          | padding right                        |
| m             | `SpacingToken` \| `number`        | -          | margin (all sides)                   |
| mx            | `SpacingToken` \| `number`        | -          | margin horizontal                    |
| my            | `SpacingToken` \| `number`        | -          | margin vertical                      |
| mt            | `SpacingToken` \| `number`        | -          | margin top                           |
| mb            | `SpacingToken` \| `number`        | -          | margin bottom                        |
| ml            | `SpacingToken` \| `number`        | -          | margin left                          |
| mr            | `SpacingToken` \| `number`        | -          | margin right                         |
| gap           | `SpacingToken` \| `number`        | -          | flexbox gap                          |
| rowGap        | `SpacingToken` \| `number`        | -          | flexbox row gap                      |
| columnGap     | `SpacingToken` \| `number`        | -          | flexbox column gap                   |
| bg            | `BackgroundToken`                | -          | background color                     |
| radius        | `RadiusToken`                     | -          | border radius                        |
| shadow        | `ShadowToken`                     | -          | shadow level                        |
| borderWidth   | `number`                           | -          | border width                         |
| borderColor   | `BorderColorToken`                | -          | border color                         |
| flex          | `number`                           | -          | ~~flex grow factor~~ (use `grow` instead)     |
| grow          | `number`                           | -          | flex grow factor                              |
| children      | `ReactNode`                        | -          | children nodes                                |
| style         | `ViewStyle`                        | -          | additional styles (highest priority)          |

## usage

```tsx
import { Flex } from "@/components"

<Flex direction="row" align="center" justify="between">
  <Text>Left</Text>
  <Text>Right</Text>
</Flex>
```
