import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Button, Pressable } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import BannerView from '@/components/BannerView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TextBanner } from '@/components/TextBanner';

import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

// import Button from '@/components/Button';

import { useClerk } from '@clerk/clerk-expo';
import GridView from '@/components/GridView';

import { db } from '@/firebaseConfig';
import { getGridPhotos, getProfilePhoto } from '@/components/utils/dataUtils';

import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ProfileIcon from '@/components/ProfileIcon';
import ProfileImageViewer from '@/components/ProfileImageViewer';

export default function ProfileScreen() {
  const { user } = useUser();
  const username = user?.emailAddresses[0]["emailAddress"];
  const [selectedImage, setSelectedImage] = useState("");

  const { signOut } = useClerk();
  const router = useRouter();

  const [photos, setPhotos] = useState<any>([]);


  // Function to log out user
  const handleLogout = async () => {
    try {
      await signOut();
      console.log('User signed out successfully');
      router.replace("/");
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchPhotos = async () => {
        // check to see if there is a profile image uploaded, if so set image
        getProfilePhoto({db, currentUsername:username, setSelectedImage});
        // get photos from Posts
        const data = await getGridPhotos(db, username ?? "");
        console.log(data);
        setPhotos(data);
      }

      fetchPhotos();
    }, []) // Empty dependency array 
  );

  const PlaceholderImage = require('../../assets/images/blank_profile_pic.webp');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <SignedIn>
          <TextBanner
            text={"My Profile"}
          ></TextBanner>
          <View style={styles.pfpLogout}>
            <View style={styles.profilePicContainer}>
              <ProfileImageViewer placeholderImageSource={PlaceholderImage} 
              selectedImage={selectedImage} setSelectedImage={setSelectedImage} username={username}/>
              <ThemedText>{user?.fullName ?? ""}</ThemedText>
            </View>
            <Pressable onPress={handleLogout} style={({pressed}) => [
              {
                backgroundColor: pressed ? '#c7c7c7' : '#D9D9D9',
              },
              styles.logoutBtn,]} 
            >
              <ThemedText>Logout</ThemedText>
            </Pressable>
          </View>
          
          <GridView data={photos} />
        </SignedIn>
      </SafeAreaView>
      <SafeAreaView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    // padding: 20,
  },
  logoutBtn: {
    width: 160,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    top: '10%',
  },
  pfpLogout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-around",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  profilePicContainer: {
    justifyContent: 'center',
    alignItems: "center",
  }
});
