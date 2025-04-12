import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

import ImageViewer from '@/components/ImageViewer';
import Button from '@/components/Button';

import TextBanner from '@/components/TextBanner';

import { useUser } from "@clerk/clerk-expo";

import { db } from '@/firebaseConfig';
import { arrayUnion, doc, setDoc, Timestamp } from "firebase/firestore";
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage';

const { width, height } = Dimensions.get('window');
// console.log(width);
// console.log(height);

const PlaceholderImage = require('../../assets/images/react-logo.png');

export default function UploadScreen() {
    const { user } = useUser();
    const username = user?.emailAddresses[0]["emailAddress"];
    // console.log(user?.emailAddresses[0]["emailAddress"]);

    const [selectedImage, setSelectedImage] = useState("");

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            // Compress image because it may be too big and crash the app
            const manipResult = await ImageManipulator.manipulateAsync(
                result.assets[0].uri,
                [{ resize: { width: 800 } }], // Resize to 800px width
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            setSelectedImage(manipResult.uri);
        }
    };

    const uploadImage = async () => {
        if (!selectedImage) return;

        const response = await fetch(selectedImage);
        const blob = await response.blob();

        const imgName = `${Date.now()}.jpg`;
        const storageRef = ref(getStorage(), `images/${imgName}`);

        uploadBytes(storageRef, blob).then(async (snapshot) => {
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log('Uploaded a blob or file! Download URL:', downloadURL);

            await setDoc(doc(db, "Photos", imgName), {
                reference: `/boilerplate-7545b.appspot.com/images/${imgName}`,
                userId: username,
                uploadTime: Timestamp.now()
            });

            await setDoc(doc(db, "Users", username ?? ''), {
                Posts: arrayUnion(imgName)
            }, { merge: true });

            Alert.alert('Note', 'Your photo has been uploaded!')
        }).catch((error) => {
            console.error('Error uploading image:', error);
        });

    };

    useFocusEffect(
        useCallback(() => {
            // Open image picker modal when screen comes to focus
            pickImageAsync();

            // Optional cleanup function
            return () => {
                console.log('Screen is unfocused');
            };
        }, [])
    );

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView>
                <TextBanner text="Upload"></TextBanner>
                <ThemedView style={styles.imageContainer}>
                    <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
                </ThemedView>
                <ThemedView style={styles.footerContainer}>
                    <Button label="Choose a photo" theme="primary" onPress={pickImageAsync} width={width * 0.8} height={68} />
                    <Button label="Use this photo" onPress={uploadImage} width={width * 0.8} height={68} />
                </ThemedView>
                <StatusBar style="auto" />
            </SafeAreaView>
        </ThemedView>
    );
}


const styles = StyleSheet.create({
    container: {
        // display: "flex",
        flex: 1,
        justifyContent: 'center', // Centers children vertically
        alignItems: 'center', // Centers children horizontally
        backgroundColor: '#fff',
    },
    imageContainer: {
        // flex: 1,
        // paddingTop: 20,
        width: width * 0.95, // 90% of the screen width
        height: height * 0.5, // 50% of the screen height
    },
    footerContainer: {
        // flex: 1 / 3,
        // alignItems: 'center',
        top: height * 0.02
    },
});
