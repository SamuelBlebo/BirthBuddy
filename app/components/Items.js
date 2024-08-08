import React, { useState, useEffect } from "react";
import { Link } from "expo-router";
import { StyleSheet, Button, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function Items() {
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
    <ThemedView className="px-10 py-5 h-[100%]">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView className="flex flex-row justify-between p-2.5 border-b border-gray-300">
            <ThemedText>{item.text}</ThemedText>
            <ThemedView className="flex flex-row">
              <Button title="Edit" onPress={() => editItem(item)} />
              <Button title="Delete" onPress={() => deleteItem(item.id)} />
            </ThemedView>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
