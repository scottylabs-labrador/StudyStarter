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

  // useEffect to handle side effects based on session creation and user
  useEffect(() => {
    const updateFirestore = async () => {
      if (createdSessionId && user) {
        try {
          const username = user.emailAddresses[0]["emailAddress"];
          await setDoc(doc(db, "Users", username), {
          }, { merge: true });

          console.log('User logged in successfully and Firestore updated');
        } catch (err) {
          console.error("Firestore error", err);
        }
      }
    };

    updateFirestore();
  }, [createdSessionId, user]);

  const { isSignedIn } = useAuth();
  if (isSignedIn) {
    return <Redirect href="feed" />;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <View style={styles.container}>
          <ThemedText style={styles.heading} type="title">
            Login
          </ThemedText>
          <ThemedText style={styles.centerText}>Welcome to InstaPlate!</ThemedText>
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
