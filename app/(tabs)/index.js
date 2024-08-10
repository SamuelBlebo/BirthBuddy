import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Platform, Text } from "react-native";
import { Link } from "expo-router";

import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Items from "../components/Items";

console.log(ParallaxScrollView, ThemedText, ThemedView, Items);

export default function HomeScreen() {
  return (
    <ThemedView className=" h-[100vh]">
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Text>Home</Text>
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
