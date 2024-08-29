import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons/";

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [theme, setTheme] = useState("system");
  const [syncOption, setSyncOption] = useState("icloud");
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [isThemePickerVisible, setThemePickerVisible] = useState(false);
  const [isSyncPickerVisible, setSyncPickerVisible] = useState(false);

  const currentColorScheme = theme === "system" ? systemColorScheme : theme;
  const textColor = currentColorScheme === "dark" ? "#fff" : "#000";
  const backgroundColor = currentColorScheme === "dark" ? "#232628" : "#fff";

  const togglePicker = (picker) => {
    if (picker === "theme") {
      setThemePickerVisible(!isThemePickerVisible);
      setSyncPickerVisible(false);
    } else {
      setSyncPickerVisible(!isSyncPickerVisible);
      setThemePickerVisible(false);
    }
  };

  const handleRateApp = () => {
    Alert.alert("Rate App", "This will open the app store for rating.");
  };

  const handleAboutApp = () => {
    Alert.alert("About App", "This is the app information.");
  };

  const handleNotificationToggle = () => {
    setNotificationEnabled((prev) => !prev);
    // Notify RootLayout or a global state management solution to handle enabling/disabling notifications
  };

  return (
    <View className="h-[100%]">
      <View className="px-5 pt-8 mb-12">
        <Text className="font-bold text-[35px]" style={{ color: textColor }}>
          Settings
        </Text>
      </View>

      <View className="items-center">
        <View
          className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
          style={{ backgroundColor }}
        >
          <Text className="font-bold" style={{ color: textColor }}>
            Notification
          </Text>
          <Switch
            value={notificationEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ true: "#6495ED" }}
          />
        </View>

        <View
          className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
          style={{ backgroundColor }}
        >
          <Text className="font-bold" style={{ color: textColor }}>
            Appearance
          </Text>

          <TouchableOpacity
            onPress={() => togglePicker("theme")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text
              className="font-bold"
              style={{ color: textColor, marginRight: 8 }}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Text>
            <Ionicons
              name={isThemePickerVisible ? "chevron-up" : "chevron-down"}
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
        </View>

        {isThemePickerVisible && (
          <View
            style={{
              width: "80%",
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor,
            }}
          >
            <Picker
              selectedValue={theme}
              onValueChange={(itemValue) => setTheme(itemValue)}
              itemStyle={{ color: textColor }}
            >
              <Picker.Item label="System" value="system" />
              <Picker.Item label="Light" value="light" />
              <Picker.Item label="Dark" value="dark" />
            </Picker>
          </View>
        )}

        <View
          className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
          style={{ backgroundColor }}
        >
          <Text className="font-bold" style={{ color: textColor }}>
            Backup, Restore, and Sync
          </Text>

          <TouchableOpacity
            onPress={() => togglePicker("sync")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text
              className="font-bold"
              style={{ color: textColor, marginRight: 8 }}
            >
              {syncOption === "icloud" ? "iCloud" : "Google Drive"}
            </Text>
            <Ionicons
              name={isSyncPickerVisible ? "chevron-up" : "chevron-down"}
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
        </View>

        {isSyncPickerVisible && (
          <View
            style={{
              width: "80%",
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor,
            }}
          >
            <Picker
              selectedValue={syncOption}
              onValueChange={(itemValue) => setSyncOption(itemValue)}
              itemStyle={{ color: textColor }}
            >
              <Picker.Item label="iCloud" value="icloud" />
              <Picker.Item label="Google Drive" value="google_drive" />
            </Picker>
          </View>
        )}

        <View
          className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
          style={{ backgroundColor }}
        >
          <Text className="font-bold" style={{ color: textColor }}>
            Privacy and Security
          </Text>
          <Switch
            value={privacyEnabled}
            onValueChange={setPrivacyEnabled}
            trackColor={{ true: "#6495ED" }}
          />
        </View>

        <View
          className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
          style={{ backgroundColor }}
        >
          <Text className="font-bold" style={{ color: textColor }}>
            Rate App
          </Text>
          <TouchableOpacity onPress={handleRateApp}>
            <Ionicons name="star" size={24} color={"#6495ED"} />
          </TouchableOpacity>
        </View>

        <View
          className="w-[90%] flex-row items-center justify-between rounded-[12px] h-[60px] px-4 mb-4 shadow-md"
          style={{ backgroundColor }}
        >
          <Text className="font-bold" style={{ color: textColor }}>
            About App
          </Text>
          <TouchableOpacity onPress={handleAboutApp}>
            <Ionicons name="information-circle" size={24} color={"#6495ED"} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
