import React, { useState } from "react";
import { Photo } from "./utils/types";
import { Image, View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";


interface PostProps {
    item: Photo,
}

// 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg'

const Post = ({item}:PostProps) => {
    // Do this to get the timeStamp
    // const [timestamp, setTimestamp] = useState();
    // if (item.uploadTime) {
    //     console.log(item.uploadTime.toDate());
    // }
    

    return (
        <View style={styles.postContainer}>
            <View style={styles.userNameContainer}>
                <ThemedText>{item.userId}</ThemedText>
            </View>
            <ThemedView style={styles.imageContainer}>
                <Image 
                    style={styles.image}
                    source={{uri: item.reference}}
                    resizeMode="contain"
                />
            </ThemedView>

        </View>
    )
}

export default Post;

const styles = StyleSheet.create({
    image: {
        height: 400,
    },
    postContainer: {
        // backgroundColor: 'gray',
        borderColor: 'gray',
        borderWidth: 1,
        paddingBottom: 2,
    },
    imageContainer: {
        // backgroundColor: '#c2c2c2',
        height: 400,
        justifyContent: 'center',
    },
    userNameContainer: {
        // backgroundColor: 'white',
        padding: 3,
        paddingTop: 10,
        paddingLeft: 6,
    }
})