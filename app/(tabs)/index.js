import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Platform } from "react-native";
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
    <ThemedView>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Items />
    </ThemedView>
  );
}

const styles = StyleSheet.create({});
