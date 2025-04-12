import ParallaxScrollView from '@/components/ParallaxScrollView';
import Post from '@/components/Post';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

import { db } from '@/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { ScrollView, StyleSheet } from 'react-native';
import { getPhotos, getPhotoURL } from '@/components/utils/dataUtils';
import TextBanner from '@/components/TextBanner';

import { useUser } from "@clerk/clerk-expo";

// Note: timestamp in firebase is different from Date object, need to convert.
// see Post.tsx for details
// https://stackoverflow.com/questions/52247445/how-do-i-convert-a-firestore-date-timestamp-to-a-js-date

export default function FeedScreen() {
    const { user } = useUser();
    const username = user?.emailAddresses[0]["emailAddress"];

    const [photoCollection, setPhotoCollection] = useState<any>();

    useFocusEffect(
        useCallback(() => {
            const photosCol = collection(db, 'Photos');

            console.log("focus on feed");
            // Set up the listener for real-time updates
            const unsubscribe = onSnapshot(photosCol, async (snapshot) => {
                try {
                    // Fetch and sort photos when there are updates
                    const photoList = await getPhotos(db, username ?? "");
                    setPhotoCollection(photoList);
                    // console.log("Real-time data fetched, sorted, and state updated:", photoList);
                } catch (error) {
                    console.error('Error resolving promises:', error);
                }
            });


            //   const func = () => {
            //     getPhotos(db).then(async (photoSnapshot) => {
            //       try {
            //         console.log("feed retrieved");
            //         const results = await Promise.all(photoSnapshot);
            //         setPhotoCollection(results);
            //         // Now 'results' is an array of objects
            //       } catch (error) {
            //         console.error('Error resolving promises:', error);
            //       }
            //     });
            //   };

            //   func();

            // Clean up the listener when the screen is unfocused or unmounted
            return () => {
                console.log("Cleaning up Firestore listener...");
                unsubscribe();
            };
        }, []) // Empty dependency array 
    );

    return (
        <ThemedView style={{ flex: 1 }}>
            <SafeAreaView >
                <TextBanner text={"Feed"} />
                <ScrollView>
                    {photoCollection && photoCollection.map((doc: any, index: number) => (
                        <Post key={index} item={doc} />
                    ))}
                </ScrollView>

            </SafeAreaView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
})
