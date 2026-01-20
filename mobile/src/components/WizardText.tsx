import { Text, 
  TextProps, 
  StyleSheet, 
  TextInput, 
  TextInputProps, 
  View, 
  Pressable, 
  PressableProps, 
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
  Keyboard, 
} from "react-native";
import { useTheme } from "@/src/theme/usetheme";
import { Card } from "@/src/components/Card";
import React, { useState, forwardRef } from "react";

//////////TEXT///////////

export function WizardTitle(props: TextProps) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      style={[
        styles.title,
        { color: theme.text, 
        fontFamily: "YuseiMagic"},
        props.style,
      ]}
    />
  );
}

export function WizardBody(props: TextProps) {
  const theme = useTheme();

  return (
    <Text
      {...props}
      style={[styles.body, { color: theme.textMuted, fontFamily: "Nunito"}, props.style]}
    />
  );
}

//////////INPUT////////

export const WizardInput = forwardRef<TextInput, TextInputProps> (
  function WizardInput(props, ref) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      {...props}
      ref={ref}
      onFocus={() => setFocused(true)}
      onBlur = {()=> setFocused(false)}
      placeholderTextColor={theme.textMuted}
      selectionColor={theme.accent}   // cursor + selection color
      style={[
        {
          borderWidth: 1,
          borderRadius: 10,
          padding: 12,
          marginTop: 12,
          borderColor: focused ? theme.accent : theme.border,
          color: theme.text,
        },
        props.style,
      ]}
    />
  );
}
);

/////////////BUTTON////////////
type WizardButtonProps = PressableProps & {
  loading?: boolean;
  children: React.ReactNode;
};

export function WizardButton({
  loading,
  children,
  style,
  disabled,
  ...rest
}: WizardButtonProps) {
  const theme = useTheme();

  const baseStyle: StyleProp<ViewStyle> = [
    styles.button,
    { backgroundColor: theme.primary, opacity: disabled || loading ? 0.6 : 1 },
  ];

  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      style={(state: PressableStateCallbackType) => {
        const userStyle =
          typeof style === "function" ? style(state) : style;

        return [
          baseStyle,
          state.pressed && { opacity: 0.85 },
          userStyle,
        ];
      }}
    >
      {children}
    </Pressable>
  );
}


///////////////AUTH SCREEN /////////

type WizardAuthScreenProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function WizardAuthScreen({ title, subtitle, children }: WizardAuthScreenProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card>
        <WizardTitle>{title}</WizardTitle>
        {subtitle && <WizardBody>{subtitle}</WizardBody>}
        {children}
      </Card>
    </View>
  );
}

/////////////STYLESSSSS//////

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginTop: 16,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  style: {},
});
