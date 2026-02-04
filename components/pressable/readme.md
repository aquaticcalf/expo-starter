# Pressable

Animated pressable wrapper with scale and opacity feedback using React Native's built-in Animated API.

## api reference

| prop           | type                  | default | description                           |
|----------------|-----------------------|---------|---------------------------------------|
| scaleOnPress   | `number`              | `0.97`  | scale factor when pressed             |
| opacityOnPress | `number`              | `0.8`   | opacity when pressed                  |
| durationMs     | `number`              | -       | animation duration in milliseconds     |
| disabled       | `boolean`            | `false` | disable press animation               |
| children       | `ReactNode`          | -       | pressable content                     |
| style          | `ViewStyle` \| `ViewStyle[]` | - | additional styles (highest priority)  |

## usage

```tsx
import { Pressable } from "@/components"

<Pressable onPress={() => alert("pressed")}>
  <Text>Press me</Text>
</Pressable>
```
