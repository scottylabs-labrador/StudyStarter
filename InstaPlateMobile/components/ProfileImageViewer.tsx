import { StyleSheet, Image, ImageSourcePropType, Dimensions, View, Pressable } from 'react-native';

import { pickProfileImageAsync, uploadProfileImage } from './utils/dataUtils';

type Props = {
  placeholderImageSource: ImageSourcePropType,
  selectedImage: string,
  setSelectedImage:  React.Dispatch<React.SetStateAction<string>>,
  username?: string,
};

export default function ProfileImageViewer({
  placeholderImageSource,
  selectedImage,
  setSelectedImage,
  username,
}: Props) {
  const imageSource = selectedImage != "" ? { uri: selectedImage } : placeholderImageSource;

  const uploadImage = async () => {
      pickProfileImageAsync({selectedImage, setSelectedImage, username}).then(()=>{
        console.log('peace');
      }).catch((error) => {
        console.error('Error uploading image:', error);
      });
  }

  return (
    <Pressable style={styles.container} onPress={()=>uploadImage()}>
      <View style={styles.imageContainer}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%', 
    borderRadius: 40,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginBottom: 6,
  }
});
