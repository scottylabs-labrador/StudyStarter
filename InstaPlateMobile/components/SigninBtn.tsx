import React from "react";
import { Pressable, GestureResponderEvent, Image } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
// https://developers.google.com/identity/branding-guidelines

type OnPressHandler = (event: GestureResponderEvent) => void;

type Props = {
    theme?: string,
    width: number,
    height: number,
    onPress?: OnPressHandler
};

export default function SigninBtn({
    theme,
    width, 
    height,
    onPress
}: Props) {
    const lightImage = "google_signin_ios_light_2x";
    const darkImage = "google_sigin_ios_dark_2x";

    return (
        // { width: width, height: height }
        <ThemedView style={[{ width: width, height: height, backgroundColor: '', }]}>
                <Pressable
                    onPress={onPress}
                >
                    {theme==="dark"? (
                        <Image 
                        style={[{ maxWidth: '100%' }]} 
                        source={require(`../assets/images/${darkImage}.png`)} 
                        resizeMode = "contain"
                        accessibilityLabel="Sign in with Google"
                    />
                    ):(
                        <Image 
                        style={[{ maxWidth: '100%' }]} 
                        source={require(`../assets/images/${lightImage}.png`)} 
                        resizeMode = "contain"
                        accessibilityLabel="Sign in with Google"
                    />
                    )}
                    
                </Pressable>
            </ThemedView>
    );
}