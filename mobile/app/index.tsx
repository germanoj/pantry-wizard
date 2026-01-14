// this index is for the introsplash - animation and buttons to navigate
// web-safe: on web, skip lottie timeline and show UI immediately (prevents "stuck" splash)

import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";

export default function IntroSplash() {
  const isWeb = Platform.OS === "web";

  const [ready, setReady] = useState(false);

  // lottie refs
  const wandRef = useRef<LottieView>(null);
  const sparklesRef = useRef<LottieView>(null);
  const poofRef = useRef<LottieView>(null);

  // lottie visibility
  const [showSparkles, setShowSparkles] = useState(false);
  const [showPoof, setShowPoof] = useState(false);
  const [showWand, setShowWand] = useState(true);

  // reanimated values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const logoY = useSharedValue(16);

  const actionsOpacity = useSharedValue(0);
  const actionsY = useSharedValue(12);

  const wandOpacity = useSharedValue(1);

  const startLogoTimeline = () => {
    logoOpacity.value = withTiming(1, { duration: 450 });
    logoScale.value = withSequence(
      withTiming(1.05, { duration: 350, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) })
    );
    logoY.value = withTiming(0, { duration: 450 });

    actionsOpacity.value = withDelay(450, withTiming(1, { duration: 350 }));
    actionsY.value = withDelay(450, withTiming(0, { duration: 350 }));

    setTimeout(() => setReady(true), 850);
  };

  useEffect(() => {
    // ✅ WEB: skip lottie entirely; show UI immediately (prevents infinite splash)
    if (isWeb) {
      setShowWand(false);
      setShowSparkles(false);
      setShowPoof(false);

      // snap UI to visible
      logoOpacity.value = 1;
      logoScale.value = 1;
      logoY.value = 0;

      actionsOpacity.value = 1;
      actionsY.value = 0;

      setReady(true);
      return;
    }

    // ✅ NATIVE: start wand immediately
    wandRef.current?.play();
  }, [isWeb]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }, { scale: logoScale.value }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{ translateY: actionsY.value }],
  }));

  const wandStyle = useAnimatedStyle(() => ({
    opacity: wandOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* 1) Wand (native only) */}
      {!isWeb && showWand && (
        <Animated.View
          style={[StyleSheet.absoluteFill, wandStyle]}
          pointerEvents="none"
        >
          <LottieView
            ref={wandRef}
            source={require("../assets/lottie/magicWand.json")}
            autoPlay={false}
            loop={false}
            style={styles.lottie}
            onAnimationFinish={() => {
              // fade the wand out
              wandOpacity.value = withTiming(0, { duration: 300 });

              // after fade completes, unmount wand and start next steps
              setTimeout(() => {
                setShowWand(false);

                // 2) sparkles
                setShowSparkles(true);
                setTimeout(() => sparklesRef.current?.play(), 80);

                // 3) poof shortly after sparkles begin
                setShowPoof(true);
                setTimeout(() => poofRef.current?.play(), 240);

                // 4) UI appears shortly after poof begins
                setTimeout(() => startLogoTimeline(), 350);
              }, 300);
            }}
          />
        </Animated.View>
      )}

      {/* 2) Sparkles (native only) */}
      {!isWeb && showSparkles && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <LottieView
            ref={sparklesRef}
            source={require("../assets/lottie/sparkles.json")}
            autoPlay={false}
            loop
            style={styles.lottie}
            // NOTE: loop=true means onAnimationFinish won't fire on web/native reliably; we hide via state elsewhere
            onAnimationFinish={() => setShowSparkles(false)}
          />
        </View>
      )}

      {/* 3) Poof (native only) */}
      {!isWeb && showPoof && (
        <View pointerEvents="none" style={styles.poofWrap}>
          <LottieView
            ref={poofRef}
            source={require("../assets/lottie/poof.json")}
            autoPlay={false}
            loop={false}
            style={styles.poofLottie}
            onAnimationFinish={() => setShowPoof(false)}
          />
        </View>
      )}

      {/* logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Text style={styles.logoText}>🧙 Pantry Wizard</Text>
      </Animated.View>

      {/* actions */}
      <Animated.View style={[styles.actions, actionsStyle]}>
        <Pressable
          disabled={!ready}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.btnText}>Login</Text>
        </Pressable>

        <Pressable
          disabled={!ready}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.btnText}>Register</Text>
        </Pressable>

        <Pressable
          disabled={!ready}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.push("/(tabs)/chatBot")}
        >
          <Text style={styles.btnText}>Visit the Wizard!</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

// pointer events set to none so you can press the buttons (even when sparkles are on top)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "black",
  },
  lottie: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "800",
    color: "white",
  },
  actions: {
    width: "100%",
    gap: 12,
    marginTop: 18,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
  },
  btnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  poofWrap: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 260,
    height: 260,
    transform: [{ translateX: -100 }, { translateY: -200 }],
  },
  poofLottie: {
    width: "100%",
    height: "100%",
  },
});
