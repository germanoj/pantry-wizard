// this index is for the introsplash - animation and buttons to navigate
//
// 1 app opens to index page
// 2 sparkle, poof animation
// 3 pantry wizard logo appears
// 4 buttons fade in (login, register, chat)
// (no redirect, user chooses) — except when already authed (token)

import { useEffect, useRef, useCallback, useState } from "react";
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

import { useSplash } from "@/src/auth/SplashContext";
import { useAuth } from "@/src/auth/AuthContext";

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
  const logoOpacity = useSharedValue(0); // starts invisible
  const logoScale = useSharedValue(0.2); // starts small
  const logoY = useSharedValue(24); // starts lower

  const actionsOpacity = useSharedValue(0);
  const actionsY = useSharedValue(12);
  const wandOpacity = useSharedValue(1);

  const { setSplashDone } = useSplash();
  const { token, isLoading } = useAuth();

  // reset when screen mounts
  useEffect(() => {
    setSplashDone(false);
    setReady(false);
  }, [setSplashDone]);

  // Timeline: reveal logo, then actions (only if logged out)
  const startLogoTimeline = useCallback(() => {
    // logo animation
    logoOpacity.value = withDelay(40, withTiming(1, { duration: 220 }));
    logoScale.value = withSequence(
      withTiming(1.28, {
        duration: 420,
        easing: Easing.out(Easing.back(2.2)),
      }),
      withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) })
    );
    logoY.value = withTiming(0, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });

    // actions only when logged out
    if (!token) {
      actionsOpacity.value = withDelay(450, withTiming(1, { duration: 350 }));
      actionsY.value = withDelay(450, withTiming(0, { duration: 350 }));
    }

    const t = setTimeout(() => {
      setSplashDone(true);

      if (!token) {
        setReady(true);
      } else {
        // redirect away from splash when already authed
        router.replace("/(tabs)/chatBot");
      }
    }, token ? 700 : 850);

    return () => clearTimeout(t);
  }, [
    token,
    setSplashDone,
    logoOpacity,
    logoScale,
    logoY,
    actionsOpacity,
    actionsY,
  ]);

  // Web: skip lottie; show UI immediately (prevents infinite splash)
  useEffect(() => {
    if (isLoading) return;
    if (!isWeb) return;

    setShowWand(false);
    setShowSparkles(false);
    setShowPoof(false);

    logoOpacity.value = 1;
    logoScale.value = 1;
    logoY.value = 0;

    actionsOpacity.value = token ? 0 : 1;
    actionsY.value = token ? 20 : 0;

    setSplashDone(true);

    if (token) router.replace("/(tabs)/chatBot");
    else setReady(true);
  }, [
    isWeb,
    isLoading,
    token,
    setSplashDone,
    logoOpacity,
    logoScale,
    logoY,
    actionsOpacity,
    actionsY,
  ]);

  // Native: when auth state is known, kick off wand (or skip if authed)
  useEffect(() => {
    if (isWeb) return;
    if (isLoading) return;

    if (token) {
      setSplashDone(true);
      router.replace("/(tabs)/chatBot");
      return;
    }

    // reset visibility in case you revisit this screen
    setShowWand(true);
    setShowSparkles(false);
    setShowPoof(false);

    wandOpacity.value = withTiming(1, { duration: 0 });
    wandRef.current?.play();
  }, [isWeb, isLoading, token, setSplashDone, wandOpacity]);

  // Native failsafe: if lottie never finishes, still proceed
  useEffect(() => {
    if (isWeb) return;
    if (isLoading) return;
    if (token) return;

    const t = setTimeout(() => {
      startLogoTimeline();
      // don't setReady(true) here; the timeline will handle it
    }, 2500);

    return () => clearTimeout(t);
  }, [isWeb, isLoading, token, startLogoTimeline]);

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
      {showWand && !isWeb && (
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
      {showSparkles && !isWeb && (
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
      {showPoof && !isWeb && (
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
    fontSize: 36, // 46–56 will give that big pop feel
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
