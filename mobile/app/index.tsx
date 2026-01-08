//this index is for the introsplash - animation and buttons to navigate

//1 app opens to index page
//2 sparkle, poof annimation
//3 pantry wizard logo appears 
//4 buttons fade in (login, register, chat)
//(no redirect, user chooses)

import { useEffect, useState, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
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
import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";


export default function IntroSplash() {
  const [ready, setReady] = useState(false);

  // lottie refs
  const wandRef = useRef<LottieView>(null);
  const sparklesRef = useRef<LottieView>(null);
  const poofRef = useRef<LottieView>(null);

  //lottie visibility
  const [showSparkles, setShowSparkles] = useState(false);
  const [showPoof, setShowPoof] = useState(false);
  const [showWand, setShowWand] = useState(true); //to unmount the wand (clear it when it finishes)

// reanimated values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const logoY = useSharedValue(16);

  const actionsOpacity = useSharedValue(0);
  const actionsY = useSharedValue(12);

  const wandOpacity = useSharedValue(1);


    // Timeline:
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
    // 1) start wand immediately
    wandRef.current?.play();
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
    <View pointerEvents="none" style={styles.container}>
    {showWand && (
        <Animated.View style ={[StyleSheet.absoluteFill, wandStyle]} pointerEvents={"none"}>
        <LottieView
        ref={wandRef}
        source={require("../assets/lottie/magicWand.json")}
        autoPlay={false}
        loop={false} // no loops
        style={styles.lottie}
        onAnimationFinish={() => {
         //hide wand completely
            setShowWand(false);
          // 2) Sparkles next
          setShowSparkles(true);
          // tiny delay helps feel like the wand “caused” it
          setTimeout(() => sparklesRef.current?.play(), 80);

          // 3) Poof shortly after sparkles begin
          setShowPoof(true);
          setTimeout(() => poofRef.current?.play(), 240);

         // 4) UI appears shortly after poof begins
          setTimeout(() => startLogoTimeline(), 350);
        }}
      />
      </Animated.View>
    )}

      {/* Sparkles */}
      {showSparkles && (
        <LottieView
          ref={sparklesRef}
          source={require("../assets/lottie/sparkles.json")}
          autoPlay={false}
          loop={false} // no loop
          style={styles.lottie}
          onAnimationFinish={() => setShowSparkles(false)}
        />
      )}
      

{/* 3) Poof (plays once, then disappears) */}
      {showPoof && (
        <View pointerEvents="none" style={styles.poofWrap}>
        <LottieView
          ref={poofRef}
          source={require("../assets/lottie/poof.json")}
          autoPlay={false}
          loop={false} // no loop
          style={styles.lottie}
          onAnimationFinish={() => setShowPoof(false)}
        />
        </View>
      )}

      {/* logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Text style={styles.logoText}>🧙 Pantry Wizard</Text>
      </Animated.View>

      {/* actionss */}
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
          onPress={() => router.push("/chatBot")}
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
    color: "white"
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
    color: "white"
  },
  poofWrap: {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: 260,
  height: 260,
  transform: [
    { translateX: -100 }, // left to right, lower number is left
    { translateY: -200 }, // this bit moves it up and down
  ],
},
poofLottie: { //here controls size
  width: "100%",
  height: "100%",
},
});