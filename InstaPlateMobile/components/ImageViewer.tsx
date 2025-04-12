import { StyleSheet, Image, ImageSourcePropType, Dimensions } from 'react-native';

import type { PropsWithChildren } from 'react';

type Props = {
  placeholderImageSource: ImageSourcePropType,
  selectedImage: string
};

export default function ImageViewer({
  placeholderImageSource,
  selectedImage
}: Props) {
  const imageSource = selectedImage != "" ? { uri: selectedImage } : placeholderImageSource;

  return (
    <Image source={imageSource} style={styles.image} />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%', 
    borderRadius: 18,
  },
});
