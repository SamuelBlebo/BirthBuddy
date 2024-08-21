import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import {
  ImageBackground,
  View,
  StyleSheet,
  Text,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications is not granted!");
      }
    };

    requestNotificationPermissions();
  }, []);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const fetchNotificationSetting = async () => {
      const enabled = await AsyncStorage.getItem("notificationEnabled");
      setNotificationEnabled(JSON.parse(enabled) || false);
    };

    fetchNotificationSetting();
  }, []);

  useEffect(() => {
    const scheduleBirthdayNotifications = async () => {
      if (notificationEnabled) {
        // Clear all existing notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log("All existing notifications canceled.");

        // Get stored birthdays
        const storedItems = await AsyncStorage.getItem("birthdays");
        const birthdays = storedItems ? JSON.parse(storedItems) : [];

        console.log("Processing birthdays:", birthdays);

        birthdays.forEach((birthday) => {
          const birthDate = new Date(birthday.birthday);
          const now = new Date();

          // Set the time for notification to 3:48 PM on the birthday
          birthDate.setHours(15, 48, 0, 0);

          if (birthDate > now) {
            console.log(
              `Scheduling notification for ${
                birthday.name
              } on ${birthDate.toString()}`
            );
            Notifications.scheduleNotificationAsync({
              content: {
                title: "Birthday Reminder",
                body: `Today is ${birthday.name}'s birthday! 🎉`,
                sound: "default",
              },
              trigger: birthDate,
            })
              .then(() => {
                console.log(
                  `Notification scheduled for ${
                    birthday.name
                  } at ${birthDate.toString()}`
                );
              })
              .catch((error) => {
                console.error("Error scheduling notification:", error);
              });
          } else {
            console.log(
              `Skipping ${birthday.name}'s birthday as it is in the past.`
            );
          }
        });
      }
    };

    scheduleBirthdayNotifications();
  }, [notificationEnabled]);

  useEffect(() => {
    const notificationSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    return () => {
      notificationSubscription.remove();
    };
  }, []);

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
                className="p-1 rounded-full"
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
                className="bg-slate-200 bg-opacity-10 p-1 rounded-[50%]"
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
              <Text className="text-[#6495ED]">
                <Ionicons
                  name="close"
                  size={24}
                  className="text-[#6495ED]"
                  style={{ marginLeft: 15 }}
                  onPress={() => navigation.goBack()}
                />
              </Text>
            ),
          }}
        />
        <Stack.Screen
          name="editbirthday"
          options={{
            headerTitle: "Edit Birthday",
            presentation: "card",
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
