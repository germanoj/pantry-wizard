import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { Card } from "./Card";
import { WizardBody } from "./WizardText";

export default function AiLoadingOverlay() {
    return (
        <View style={styles.overlay} pointerEvents="auto">
            <Card centered variant="overlay">
                <LottieView
                    source={require("../../assets/lottie/magicPotion.json")}
                    autoPlay
                    loop
                    speed={0.6}
                    style={styles.lottie}
                />
                <WizardBody style={styles.text}>Brewing something delicious...</WizardBody>
            </Card>
        </View>
    );
    }

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999, // Android
    backgroundColor: "rgba(24, 16, 48, 0.88)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
lottie: {
    width: 220,
    height: 220,
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
