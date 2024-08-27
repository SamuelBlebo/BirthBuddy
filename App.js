import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons/";
import { AntDesign } from "@expo/vector-icons/";
import { FontAwesome6 } from "@expo/vector-icons/";
import HomeScreen from "./screens/HomeScreen.js";
import AllScreen from "./screens/AllScreen.js";
import CalendarScreen from "./screens/CalendarScreen.js";
import SettingScreen from "./screens/SettingScreen.js";
import { useColorScheme } from "react-native";

// Create Tab Navigator
const Tab = createBottomTabNavigator();

function MyTabs() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#007bff" : "#007bff";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            return (
              <AntDesign
                size={27}
                color={color}
                name={focused ? "home" : "home"}
              />
            );
          } else if (route.name === "All") {
            return (
              <FontAwesome6
                name={focused ? "rectangle-list" : "list-alt"}
                size={24}
                color={color}
              />
            );
          } else if (route.name === "Calendar") {
            return (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={24}
                color={color}
              />
            );
          } else if (route.name === "Settings") {
            return (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: iconColor,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="All" component={AllScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Settings" component={SettingScreen} />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
