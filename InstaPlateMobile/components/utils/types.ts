import { Timestamp } from '@firebase/firestore-types';

export interface Photo {
    reference: string;
    uploadTime: Timestamp;
    userId: string;
}

export interface selectPhotoProps {
    selectedImage?: string;
    setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}

export interface uploadProfileImageProps {
    selectedImage: string;
    setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
    username?: string;
}