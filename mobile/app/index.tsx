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

// this index is for the introsplash - animation and buttons to navigate
//
// 1 app opens to index page
// 2 sparkle, poof animation
// 3 pantry wizard logo appears
// 4 buttons fade in (login, register, chat)
// (no redirect, user chooses) — except when already authed (token)

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
<<<<<<< HEAD
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.2);
  const logoY = useSharedValue(24);
=======
  const logoOpacity = useSharedValue(0); //starts invisible, small and slightly lower (the y axis)
  const logoScale = useSharedValue(0.2); //was .7, trying smaller start
  const logoY = useSharedValue(24); //was 16, trying to start lower

>>>>>>> a1b3e57 (Fix web splash rendering and add font loading fallback)
  const actionsOpacity = useSharedValue(0);
  const actionsY = useSharedValue(12);
  const wandOpacity = useSharedValue(1);

  const { setSplashDone } = useSplash();
  const { token, isLoading } = useAuth();

  // reset when screen mounts
  useEffect(() => {
<<<<<<< HEAD
    setSplashDone(false);
    setReady(false);
=======
    setSplashDone(false); // prevents authgate thinking splash mount is done each time
    setReady(false); // optional: also reset buttons
>>>>>>> a1b3e57 (Fix web splash rendering and add font loading fallback)
  }, [setSplashDone]);

  // Timeline: reveal logo, then actions (only if logged out)
  const startLogoTimeline = useCallback(() => {
    logoOpacity.value = withDelay(40, withTiming(1, { duration: 220 }));

    logoScale.value = withSequence(
      withTiming(1.28, {
        duration: 420,
        easing: Easing.out(Easing.back(2.2)),
      }),
      withTiming(1, { duration: 240, easing: Easing.out(Easing.cubic) })
    );
<<<<<<< HEAD

    logoY.value = withTiming(0, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });

    if (!token) {
      actionsOpacity.value = withDelay(450, withTiming(1, { duration: 350 }));
      actionsY.value = withDelay(450, withTiming(0, { duration: 350 }));
<<<<<<< HEAD
    }

    const t = setTimeout(
      () => {
        setSplashDone(true);
        if (!token) setReady(true);
      },
      token ? 700 : 850
    );

    return () => clearTimeout(t);
  }, [
    actionsOpacity,
    actionsY,
=======
    } else {
=======
    logoY.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) });

    //actions if logged out , prevents seeing buttons DoNT TOUCH!!!!
    if (!token) {
>>>>>>> 750267a (fixed splash screen finally)
      actionsOpacity.value = withDelay(450, withTiming(1, { duration: 350 })); //buttons fade in after the logo
      actionsY.value = withDelay(450, withTiming(0, { duration: 350 }));
    } 

    // Mark splash done + route decisions
    setTimeout(
      () => {
        setSplashDone(true); //when splash and logo are done
        if (!token) {
          setReady(true); //only show button options if lohhed out
        } else {
          router.replace("/(tabs)");
        }
      },
      token ? 700 : 850
    ); // ready becomes true after UI, if token the movement is quicker
  }, [
    token,
    setSplashDone,
>>>>>>> a1b3e57 (Fix web splash rendering and add font loading fallback)
    logoOpacity,
    logoScale,
    logoY,
    setSplashDone,
    token,
  ]);

<<<<<<< HEAD
  // Web: skip lottie; show UI immediately (prevents infinite splash)
  useEffect(() => {
    if (isLoading) return;

    if (isWeb) {
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
    }
=======
  // Web fallback: no lottie timeline; show UI immediately
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (isLoading) return;

    // Hide lottie layers (they won't render on web anyway)
    setShowWand(false);
    setShowSparkles(false);
    setShowPoof(false);

    // Show UI immediately
    logoOpacity.value = withTiming(1, { duration: 0 });
    logoScale.value = withTiming(1, { duration: 0 });
    logoY.value = withTiming(0, { duration: 0 });

    if (!token) {
  actionsOpacity.value = withTiming(1, { duration: 0 });
  actionsY.value = withTiming(0, { duration: 0 });
  setReady(true);
} else {
  actionsOpacity.value = withTiming(0, { duration: 0 });
  actionsY.value = withTiming(12, { duration: 0 });
  // optionally: router.replace("/(tabs)");
}
setSplashDone(true);


    // Optional: if you WANT auto-redirect when logged in on web, do it explicitly:
    // if (token) router.replace("/(tabs)/chatBot");
>>>>>>> a1b3e57 (Fix web splash rendering and add font loading fallback)
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

<<<<<<< HEAD
  // Native: when auth state is known, kick off wand (or skip if authed)
=======
  // Native: kick off wand animation when auth state is known
>>>>>>> a1b3e57 (Fix web splash rendering and add font loading fallback)
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
    if (token) return; // already navigated above

    const t = setTimeout(() => {
      startLogoTimeline();
      setReady(true);
    }, 2500);

    return () => clearTimeout(t);
<<<<<<< HEAD
  }, [isWeb, isLoading, token, startLogoTimeline]);
=======
  }, [isLoading, startLogoTimeline, token]);
  {
    /*
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
  }, []); */
  }
>>>>>>> a1b3e57 (Fix web splash rendering and add font loading fallback)

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

      {/* Actions replace instead of router.push prevents swiping back to the splash screen */}
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
<<<<<<< HEAD
    fontSize: 36,
=======
    fontSize: 36, //46-56 will give that big pop feel
>>>>>>> a1b3e57 (Fix web splash rendering and add font loading fallback)
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
