import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/lottie/loadingMagic.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: 260,
    height: 260,
  },
});