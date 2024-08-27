import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const SaveForm = async (formData) => {
  // Destructure the formData object
  const { name, birthday, zodiacSign, profileImage, notes } = formData;

  // Validation logic
  if (!name.trim()) {
    Alert.alert("Validation Error", "Name is required.");
    return;
  }

  if (!birthday) {
    Alert.alert("Validation Error", "Birthday is required.");
    return;
  }

  try {
    // Get existing items
    const storedItems = await AsyncStorage.getItem("birthdays");
    const items = storedItems ? JSON.parse(storedItems) : [];

    // Add a unique id to the form data
    const formDataWithId = {
      ...formData,
      id: Date.now().toString(), // Generate a unique id using timestamp
    };

    // Add the new form data with id to the list
    items.push(formDataWithId);

    // Save the updated list back to AsyncStorage
    await AsyncStorage.setItem("birthdays", JSON.stringify(items));

    console.log("Form data saved successfully");
  } catch (error) {
    console.error("Error saving form data:", error);
  }
};

export default SaveForm;
