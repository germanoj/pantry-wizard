// this index is for the introsplash - animation and buttons to navigate
//
// 1 app opens to index page
// 2 sparkle, poof animation
// 3 pantry wizard logo appears
// 4 buttons fade in (login, register, chat)
// (no redirect, user chooses)

import { useEffect, useState, useRef } from "react";
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
    // Web fallback: lottie-react-native can be flaky on web.
    // If lottie doesn't run, onAnimationFinish never fires -> UI stays hidden.
    if (Platform.OS === "web") {
      setShowWand(false);
      setShowSparkles(false);
      setShowPoof(false);

      // Show UI immediately
      logoOpacity.value = withTiming(1, { duration: 0 });
      logoScale.value = withTiming(1, { duration: 0 });
      logoY.value = withTiming(0, { duration: 0 });

      actionsOpacity.value = withTiming(1, { duration: 0 });
      actionsY.value = withTiming(0, { duration: 0 });

      setReady(true);
      return;
    }

    // Native: start wand immediately
    wandRef.current?.play();
  }, []);

  // Failsafe: if lottie callback never fires, still show UI.
  useEffect(() => {
    if (Platform.OS === "web") return;
    const t = setTimeout(() => {
      setReady((prev) => {
        if (prev) return prev;
        startLogoTimeline();
        return true;
      });
    }, 2500);

    return () => clearTimeout(t);
  }, []);

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
      {/* Wand (native only) */}
      {showWand && Platform.OS !== "web" && (
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
              wandOpacity.value = withTiming(0, { duration: 300 });

              setTimeout(() => {
                setShowWand(false);

                setShowSparkles(true);
                setTimeout(() => sparklesRef.current?.play(), 80);

                setShowPoof(true);
                setTimeout(() => poofRef.current?.play(), 240);

                setTimeout(() => startLogoTimeline(), 350);
              }, 300);
            }}
          />
        </Animated.View>
      )}

      {/* Sparkles (native only) */}
      {showSparkles && Platform.OS !== "web" && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <LottieView
            ref={sparklesRef}
            source={require("../assets/lottie/sparkles.json")}
            autoPlay={false}
            loop={true}
            style={styles.lottie}
          />
        </View>
      )}

      {/* Poof (native only) */}
      {showPoof && Platform.OS !== "web" && (
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

      {/* Logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Text style={styles.logoText}>🧙 Pantry Wizard</Text>
      </Animated.View>

      {/* Actions */}
      <Animated.View style={[styles.actions, actionsStyle]}>
        <Pressable
          disabled={!ready}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.btnText}>Login</Text>
        </Pressable>

        <Pressable
          disabled={!ready}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.replace("/(auth)/register")}
        >
          <Text style={styles.btnText}>Register</Text>
        </Pressable>

        <Pressable
          disabled={!ready}
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.replace("/(tabs)/chatBot")}
        >
          <Text style={styles.btnText}>Visit the Wizard!</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

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
    borderColor: "rgba(255,255,255,0.25)",
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
