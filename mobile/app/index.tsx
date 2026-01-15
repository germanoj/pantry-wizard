//this index is for the introsplash - animation and buttons to navigate

//1 app opens to index page
//2 sparkle, poof annimation
//3 pantry wizard logo appears 
//4 buttons fade in (login, register, chat)
//(no redirect, user chooses)

import { useEffect, useState, useRef } from "react"; //useeffect starts the wand, useref controls lottie
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
//import { AnimatedView } from "react-native-reanimated/lib/typescript/component/View";

import { useSplash } from "@/src/auth/SplashContext";
import { useAuth } from "@/src/auth/AuthContext";


export default function IntroSplash() {
  const [ready, setReady] = useState(false); //this state controls if you can click buttons
  
  // lottie refs
  const wandRef = useRef<LottieView>(null);
  const sparklesRef = useRef<LottieView>(null);
  const poofRef = useRef<LottieView>(null);

  //lottie visibility 
  const [showSparkles, setShowSparkles] = useState(false); //starts false, becomes true after wand finishes
  const [showPoof, setShowPoof] = useState(false); // starts after sparkles
  const [showWand, setShowWand] = useState(true); //to unmount the wand (clear it when it finishes)

// reanimated values
  const logoOpacity = useSharedValue(0); //starts invisible, small and slightly lower (the y axis)
  const logoScale = useSharedValue(0.4); //was .7, trying smaller start
  const logoY = useSharedValue(16);

  const actionsOpacity = useSharedValue(0); // buttons same as logo
  const actionsY = useSharedValue(12);

  const wandOpacity = useSharedValue(1); //need to fade this out rather than quickly disappear !!

  //for redirecting away from splash screen
  const { setSplashDone } = useSplash();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    setSplashDone(false); // prevents authgate thinking splash mount is done each time 
    setReady(false); // optional: also reset buttons
  }, [setSplashDone]);

    // Timeline:
    const startLogoTimeline = () => {
    logoOpacity.value = withTiming(1, { duration: 450 }); //duration is ms
    logoScale.value = withSequence(
        withTiming(1.18, { duration: 420, easing: Easing.out(Easing.back(1.6)) }), //this increases it a little and then shrinks back
        withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) })
      );
    logoY.value = withTiming(0, { duration: 450 });

    if (!token) {actionsOpacity.value = withDelay(450, withTiming(1, { duration: 350 })); //buttons fade in after the logo
    actionsY.value = withDelay(450, withTiming(0, { duration: 350 }));}

    setTimeout(() => {
      setSplashDone(true); //when splash and logo are done
      if (!token) setReady(true); //only show button options if lohhed out
     }, token ? 700 : 850); // ready becomes true after UI, if token the movement is quicker 
  };

  useEffect(() => {
    //always play splash even if logged in 
    if (isLoading) return;
    // 1) start wand immediately
    wandRef.current?.play(); //the ? helps prevent crashing if the ref isnt ready
  }, [isLoading]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoY.value }, { scale: logoScale.value }],
  }));

  //buttons
  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{ translateY: actionsY.value }],
  }));

  const wandStyle = useAnimatedStyle(() => ({
    opacity: wandOpacity.value,
  }));

  return (
    <View style={styles.container}> 
    {showWand && ( //renders the wand first here
        <Animated.View style ={[StyleSheet.absoluteFill, wandStyle]} pointerEvents={"none"}>
        <LottieView
        ref={wandRef}
        source={require("../assets/lottie/magicWand.json")}
        autoPlay={false}
        loop={false} // no loops
        style={styles.lottie}
        onAnimationFinish={() => {
           // fade the wand out
          wandOpacity.value = withTiming(0, { duration: 300 });
         //hide wand completely
          // after fade completes, unmount wand
          setTimeout(() => {
            setShowWand(false);
          // 2) Sparkles next
            setShowSparkles(true);
          // tiny delay helps feel like the wand makes it happen
            setTimeout(() => sparklesRef.current?.play(), 80);

          // 3) Poof shortly after sparkles begin
          setShowPoof(true);
          setTimeout(() => poofRef.current?.play(), 240);

         // 4) UI appears shortly after poof begins
          setTimeout(() => startLogoTimeline(), 350);
        }, 300);
        }}
      />
      </Animated.View>
    )}
    
      {/* Sparkles */}
      {showSparkles && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>

        <LottieView
          ref={sparklesRef}
          source={require("../assets/lottie/sparkles.json")}
          autoPlay={false}
          loop={true} // yes loop, its cute
          style={styles.lottie}
          onAnimationFinish={() => setShowSparkles(false)}
        />
        </View>
      )}
      

{/* 3) Poof (plays once, then disappears) */}
      {showPoof && ( 
        <View pointerEvents="none" style={styles.poofWrap}> 
        <LottieView
          ref={poofRef}
          source={require("../assets/lottie/poof.json")}
          autoPlay={false}
          loop={false} // no loop
          style={styles.poofLottie}
          onAnimationFinish={() => setShowPoof(false)}
        />
        </View>
      )}

      {/* logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Text style={styles.logoText}>🧙 Pantry Wizard</Text>
      </Animated.View>

      {/* actionss
          replace instead of router.push prevents swiping back to the splash screen */}
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

//pointer events set to none so you can press the buttons (even when sparklesa re on top)

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