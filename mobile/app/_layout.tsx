  return (
    <AuthProvider>
      <SplashProvider>
        <AuthGate>
          <ThemePreferenceProvider>
            <GeneratedRecipesProvider>
              <NotInterestedProvider>
                <ThemeProvider
                  value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
                >
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(modals)/register-modal"
                      options={{
                        presentation: "modal",
                        title: "Create Account",
                        headerShown: false,
                      }}
                    />
                  </Stack>

                  <StatusBar style="auto" />
                </ThemeProvider>
              </NotInterestedProvider>
            </GeneratedRecipesProvider>
          </ThemePreferenceProvider>
        </AuthGate>
      </SplashProvider>
    </AuthProvider>
  );
