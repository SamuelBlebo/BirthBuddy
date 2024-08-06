import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
  Button,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("items");
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveItems = async (newItems) => {
    try {
      await AsyncStorage.setItem("items", JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error(error);
    }
  };

  const addItem = () => {
    if (text.trim()) {
      const newItems = [...items, { id: Date.now().toString(), text }];
      saveItems(newItems);
      setText("");
    }
  };

  const deleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    saveItems(newItems);
  };

  const editItem = (item) => {
    setText(item.text);
    setEditing(item.id);
  };

  const updateItem = () => {
    const newItems = items.map((item) =>
      item.id === editing ? { id: item.id, text } : item
    );
    saveItems(newItems);
    setText("");
    setEditing(null);
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#80BFFF", dark: "#6699CC" }}
      headerImage={
        <Image
          // style={styles.headerImage}
          className="w-full h-[200]"
          source={require("../../assets/images/birthday-doodle.png")}
          resizeMode="cover"
        />
      }
    >
      <StatusBar style="auto" />
      <ThemedView style={{ flex: 1, width: "100%", height: "100%" }}>
        <TextInput
          className="border border-black p-2.5 mb-2.5"
          placeholder="Enter item"
          value={text}
          onChangeText={setText}
        />
        <Button
          className="flex flex-row"
          title={editing ? "Update" : "Add"}
          onPress={editing ? updateItem : addItem}
        />
        <FlashList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex flex-row justify-between p-2.5 border-b border-gray-300">
              <Text>{item.text}</Text>
              <View className="flex flex-row">
                <Button title="Edit" onPress={() => editItem(item)} />
                <Button title="Delete" onPress={() => deleteItem(item.id)} />
              </View>
            </View>
          )}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({});
