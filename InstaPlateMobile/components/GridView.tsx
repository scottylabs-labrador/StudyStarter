import React from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList } from 'react-native';

// Get the screen width
const screenWidth = Dimensions.get('window').width;

// Number of columns in the grid
const numColumns = 3;

// Define the props interface
type GridViewProps = {
  data: { id: string; uri: string }[]; // Define the type of the data prop
}

export default function GridView({
        data
    }: GridViewProps) {
    // Render each item in the grid
    const renderItem = ({ item }: { item: { id: string; uri: string } }) => {
        return (
            <View style={styles.itemContainer}>
                <Image
                    source={{ uri: item.uri }}
                    style={styles.image}
                />
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        margin: 1,
    },
    image: {
        width: screenWidth / numColumns - 2, // Subtracting 2 for margin
        height: screenWidth / numColumns - 2,
    },
});
