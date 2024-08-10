import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // if (!zodiacSign) {
  //   Alert.alert("Validation Error", "Zodiac sign is required.");
  //   return;
  // }

  // // Optional: Validate image if required
  // if (!profileImage) {
  //   Alert.alert("Validation Error", "Profile image is required.");
  //   return;
  // }

  // Optional: Validate note if required
  // if (!notes.trim()) {
  //   Alert.alert("Validation Error", "Note cannot be empty.");
  //   return;
  // }

  try {
    // Get existing items
    const storedItems = await AsyncStorage.getItem("birthdays");
    const items = storedItems ? JSON.parse(storedItems) : [];

    // Add the new form data to the list
    items.push(formData);

    // Save the updated list back to AsyncStorage
    await AsyncStorage.setItem("birthdays", JSON.stringify(items));

    console.log("Form data saved successfully");
  } catch (error) {
    console.error("Error saving form data:", error);
  }
};

export default SaveForm;
