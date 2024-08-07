import React, { useState, useEffect } from "react";

import { View, Platform, TextInput, Button } from "react-native";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Modal() {
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
  const isPresented = router.canGoBack();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
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

      {!isPresented && <Link href="../">Dismiss</Link>}
      {/* Native modals have dark backgrounds on iOS. Set the status bar to light content and add a fallback for other platforms with auto. */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
