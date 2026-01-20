import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WizardBody } from "@/src/components/WizardText";

type WizardToastProps = {
  visible: boolean;
  message: string;
  durationMs?: number;
  placement?: "top" | "bottom";
  onHidden?: () => void;
};

export default function WizardToast({
  visible,
  message,
  durationMs = 1200,
  placement = "top",
  onHidden,
}: WizardToastProps) {
  const insets = useSafeAreaInsets();

  const opacity = useSharedValue(0);
  const y = useSharedValue(placement === "top" ? -8 : 8);

  useEffect(() => {
  if (!visible) return;

  opacity.value = withSequence(
    withTiming(1, { duration: 180, easing: Easing.out(Easing.cubic) }),
    withDelay(
      durationMs,
      withTiming(0, { duration: 220, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished && onHidden) runOnJS(onHidden)();
      })
    )
  );

  y.value = withSequence(
    withTiming(0, { duration: 180, easing: Easing.out(Easing.cubic) }),
    withDelay(durationMs, withTiming(placement === "top" ? -8 : 8, { duration: 220 }))
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [visible, durationMs, placement, onHidden]);


  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: y.value }],
  }));

  if (!visible) return null;

  const top = placement === "top" ? insets.top + 12 : undefined;
  const bottom = placement === "bottom" ? insets.bottom + 12 : undefined;

  return (
    <View pointerEvents="none" style={[styles.host, { top, bottom }]}>
      <Animated.View
        style={[
          styles.toast,
          animStyle,
          {
            backgroundColor: "rgba(20, 12, 40, 0.92)",
            borderColor: "rgba(255,255,255,0.18)",
          },
        ]}
      >
        <WizardBody style={{ color: "white", marginTop: 0, textAlign: "center" }}>
          {message}
        </WizardBody>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    left: 12,
    right: 12,
    zIndex: 9999,
    elevation: 9999,
    alignItems: "center",
  },
  toast: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
});
