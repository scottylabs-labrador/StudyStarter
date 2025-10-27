import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import { View, StyleSheet, useColorScheme } from "react-native";
import { Redirect } from "expo-router";
import { useAuth, useOAuth, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import SigninBtn from "@/components/SigninBtn";

import { db } from '@/firebaseConfig';
import { doc, setDoc } from "firebase/firestore";

// ✅ Import the calendar helper
import { setupGoogleApi, requestCalendarAccess } from "@/utils/calendar_helper";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  useWarmUpBrowser();
  const theme = useColorScheme() ?? 'light';
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user } = useUser();

  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null);
  const [calendarReady, setCalendarReady] = useState(false);

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/profile", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        setCreatedSessionId(createdSessionId);
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  // ✅ When the user logs in successfully, initialize Firestore + Calendar
  useEffect(() => {
    const afterLoginSetup = async () => {
      if (createdSessionId && user) {
        try {
          const username = user.emailAddresses[0]["emailAddress"];

          // Save user to Firestore
          await setDoc(doc(db, "Users", username), {}, { merge: true });
          console.log("User logged in successfully and Firestore updated");

          // ✅ Setup Google Calendar once, right after login
          await setupGoogleApi();
          await requestCalendarAccess();
          setCalendarReady(true);
          console.log("Google Calendar access ready for user.");
        } catch (err) {
          console.error("Setup error:", err);
        }
      }
    };

    afterLoginSetup();
  }, [createdSessionId, user]);

  const { isSignedIn } = useAuth();

  // ✅ Wait until both sign-in and calendar access are done
  if (isSignedIn && calendarReady) {
    return <Redirect href="feed" />;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <View style={styles.container}>
          <ThemedText style={styles.heading} type="title">
            Login
          </ThemedText>
          <ThemedText style={styles.centerText}>
            Welcome to InstaPlate!
          </ThemedText>
          <View style={styles.btnContainer}>
            <SigninBtn theme={theme} width={250} height={88} onPress={onPress} />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  heading: {
    textAlign: "center",
    marginTop: "28%",
    marginBottom: "10%",
  },
  centerText: {
    textAlign: "center",
  },
  btnContainer: {
    position: "absolute",
    top: "50%",
  },
});
