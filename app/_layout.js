import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground, View, StyleSheet, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";

import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            presentation: "card",
            headerTitle: "",
            headerBackground: () => (
              <ImageBackground
                source={require("../assets/images/birthday-doodle.png")}
                style={styles.headerBackground}
                resizeMode="cover"
              >
                <View style={styles.overlay} />
              </ImageBackground>
            ),
            headerLeft: () => (
              <View
                className="p-1 rounded-full "
                style={{ backgroundColor: "rgba(226, 232, 240, 0.6)" }}
              >
                <Ionicons
                  name="search"
                  size={24}
                  onPress={() => console.log("Search pressed")}
                />
              </View>
            ),
            headerRight: () => (
              <View
                className="bg-slate-200 bg-opacity-10 p-1 rounded-[50%] "
                style={{ backgroundColor: "rgba(226, 232, 240, 0.6)" }}
              >
                <Ionicons
                  name="add"
                  size={24}
                  onPress={() => navigation.navigate("addBirthdayModal")}
                />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="addBirthdayModal"
          options={{
            presentation: "modal",
            headerShown: true,
            headerBackTitleVisible: false,
            headerTitle: "Add Birthday",
            headerLeft: () => (
              <ThemedText className=" text-[#6495ED]">
                <Ionicons
                  name="close"
                  size={24}
                  className=" text-[#6495ED]"
                  style={{ marginLeft: 15 }}
                  onPress={() => navigation.goBack()}
                />
              </ThemedText>
            ),
            headerRight: () => (
              <View style={{ marginRight: 10 }}>
                <ThemedText
                  className="font-bold text-[#6495ED]"
                  onPress={() => console.log("Saved")}
                >
                  Save
                </ThemedText>
              </View>
            ),
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    width: "100%",
    height: 150,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 123, 255, 0.45)",
  },
});
