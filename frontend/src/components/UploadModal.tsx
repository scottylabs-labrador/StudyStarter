"use client";
import { useUser } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import { postImage } from "~/lib/api/postImage";
import { setIsModalOpen } from "~/lib/features/uiSlice";
import { useAppSelector } from "~/lib/hooks";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import Image from "next/image";
import uploadIcon from "../../public/assets/upload.svg";

export default function UploadModal() {
    const dispatch = useDispatch();
    const isModalOpen = useAppSelector(state => state.ui.isModalOpen);
    const {isLoaded, isSignedIn, user} = useUser();

    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    if (!isSignedIn || !user)
        return
    
    const userEmail = user?.emailAddresses[0]?.emailAddress

    if (!isModalOpen || !userEmail)
        return

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const tmp_url = URL.createObjectURL(e.target.files[0]);
            setSelectedFile(tmp_url);
        } else {
            setSelectedFile(null); 
        }
    };

    return (
        <div className="bg-[#000000A0] z-50 fixed top-0 left-0 h-screen w-screen flex justify-center items-center">
            <div className="bg-white w-[40%] h-[50%] relative flex flex-col items-center justify-center p-4 shadow-lg rounded-md">
                <button onClick={() => dispatch(setIsModalOpen(false))} className="absolute top-4 left-4 text-black text-2xl">
                    &times;
                </button>

                <Image src={selectedFile || uploadIcon} alt="Selected Image" width={200} height={200} className="bg-gray-200 p-4 rounded-full mb-4"/>

                <p className="text-lg font-semibold mb-6">Upload your file here!</p>
                <form action={(e) => {
                        postImage(e, userEmail); 
                        dispatch(setIsModalOpen(false))
                    }} 
                    className="flex flex-col items-center"
                >
                    <label className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mb-4 cursor-pointer">
                        Choose File
                        <input type="file" 
                        name="uploadedImage" 
                        accept="image/png, image/jpeg, image/heic" 
                        className="hidden" 
                        onChange={handleFileChange}/>
                    </label>
                    <button 
                        type="submit" 
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                        disabled={!selectedFile}
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
}

