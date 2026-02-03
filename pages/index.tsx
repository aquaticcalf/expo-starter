import { Text, View } from "react-native"
import { useThemedStyles } from "@/theme"

export default function Home() {
  const styles = useThemedStyles((theme) => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.app,
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      ...theme.typography.scale.base,
      color: theme.colors.foreground.default,
    },
  }))

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Page</Text>
    </View>
  )
}
