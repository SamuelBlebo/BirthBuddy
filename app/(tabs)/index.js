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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#80BFFF", dark: "#6699CC" }}
      headerImage={
        <Image
          className="w-full h-[200]"
          source={require("../../assets/images/birthday-doodle.png")}
          resizeMode="cover"
        />
      }
    >
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <ThemedView className="flex items-end">
        <ThemedText>
          <Link href="./addBirthdayModal">
            <Ionicons name="add-outline" size={28} color="black" />
          </Link>
        </ThemedText>
      </ThemedView>
      <Items />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({});
