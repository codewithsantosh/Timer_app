"use client"
import React, { useEffect } from "react"
import { View, Text, StyleSheet, Animated, Easing, StatusBar } from "react-native"
import { Clock } from "lucide-react-native"

const SplashScreen = () => {
  const scaleAnim = React.useRef(new Animated.Value(0.3)).current
  const opacityAnim = React.useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={"#ffffff"}/>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Clock size={80} color="#6366f1" />
        <Text style={styles.title}>TimerPro</Text>
      </Animated.View>
      <Text style={styles.subtitle}>Manage your time efficiently</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#6366f1",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
  },
})

export default SplashScreen

