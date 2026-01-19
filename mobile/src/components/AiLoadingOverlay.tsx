import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { WizardBody } from "./WizardText";

export default function AiLoadingOverlay() {
  return (
    <View style={styles.overlay} pointerEvents="auto">
      <LottieView
        source={require("../../assets/lottie/magicPotion.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
      <WizardBody style={styles.text}>Brewing something delicious</WizardBody>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  lottie: {
    width: 260,
    height: 260,
  },
  text: {
    marginTop: 14,
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
