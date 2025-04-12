import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

const ProfileIcon = () => {
    return (
        <View style={styles.circleContainer}>
            <Ionicons name="person-add-sharp" size={36} color="white"/>
        </View>
    )
}

export default ProfileIcon;

const styles = StyleSheet.create({
    circleContainer: {
        backgroundColor: 'black',
        borderRadius: 40,
        width: 80,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
    }
})