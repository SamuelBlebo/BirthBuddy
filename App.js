import React from "react";
import { View, ImageBackground, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons, AntDesign, FontAwesome6 } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import AllScreen from "./screens/AllScreen";
import CalendarScreen from "./screens/CalendarScreen";
import SettingScreen from "./screens/SettingScreen";
import EditBirthday from "./components/editbirthday"; // Import the EditBirthday screen
import Modal from "./components/addBirthdayModal";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#007bff" : "#007bff";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          if (route.name === "Home") {
            return <AntDesign size={27} color={color} name="home" />;
          } else if (route.name === "All") {
            return (
              <FontAwesome6 name="rectangle-list" size={24} color={color} />
            );
          } else if (route.name === "Calendar") {
            return <Ionicons name="calendar" size={24} color={color} />;
          } else if (route.name === "Settings") {
            return <Ionicons name="settings" size={24} color={color} />;
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MyTabs}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "",
            headerBackground: () => (
              <ImageBackground
                source={require("./assets/birthday-doodle.png")}
                style={{ height: "100%" }}
                resizeMode="cover"
              >
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }} />
              </ImageBackground>
            ),
            headerLeft: () => (
              <View
                style={{
                  padding: 8,
                  backgroundColor: "rgba(226, 232, 240, 0.6)",
                  borderRadius: 9999,
                }}
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
                style={{
                  padding: 8,
                  backgroundColor: "rgba(226, 232, 240, 0.6)",
                  borderRadius: 9999,
                }}
              >
                <Ionicons
                  name="add"
                  size={24}
                  onPress={() => navigation.navigate("addBirthdayModal")}
                />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="addBirthdayModal"
          component={Modal}
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "",
            headerLeft: () => (
              <View style={{ paddingLeft: 16 }}>
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="black"
                  onPress={() => navigation.goBack()}
                />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="EditBirthday"
          component={EditBirthday} // Add this line to register the screen
          options={{
            title: "Edit Birthday",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
