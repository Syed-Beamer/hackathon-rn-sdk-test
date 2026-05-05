import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Userpilot from "@userpilot/react-native";

export default function App() {
  console.log("is userpilot initialized? ", Userpilot);
  if (Userpilot) {
    Userpilot.setup("NX-382048fe", { logging: true });
    Userpilot.identify(
      "123456",
      { name: "John Doe", email: "john@example.com" },
      { id: "123456", name: "Acme Labs" },
    );
  }

  return (
    <View style={styles.container}>
      <Text>Hello </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
