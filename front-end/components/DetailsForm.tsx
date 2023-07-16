import React, { useState, ChangeEvent, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import POST from "@/api/POST/POST";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import fapp from "@/connections/firebaseconfig";
import { resolve } from "path";

const DetailsForm = () => {
  const storage = getStorage(fapp);
  const userId = useSelector((state: any) => state.auth.userId);

  type FormData = {
    uid: string;
    profImgURL: string;
    userName: string;
    name: string;
    email: string;
    bio: string;
    hobbies: string;
    occupation: string;
    education: string;
  };
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setSelectedFile(file);
      console.log(file);
      if (file!=null) {
        setPreviewUrl(URL.createObjectURL(file));
      }else{
        setPreviewUrl(null);
      }
    }
  };

  const handleUploadImageToFirebase = () => {
    if (selectedFile) {
      const storageRef = ref(storage, selectedFile.name);
      uploadBytes(storageRef, selectedFile).then(() => {
        getDownloadURL(storageRef).then((url) => {
          setValue("profImgURL", url);
        });
      });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    data.uid = userId;
    const jsonData = JSON.stringify(data);
    await handleUploadImageToFirebase();
    POST("/auth/createProfile", jsonData, function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        router.push("/home");
      }
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  return (
    <div className="flex justify-center items-center h-screen bg-white">
  <div className="max-w-md mx-auto p-6 shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
      User Details Form
    </h1>
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="relative mb-6">
          <label htmlFor="profile-image" className="sr-only">
            Choose profile photo
          </label>
          <input
            type="file"
            accept="image/*"
            id="profile-image"
            onChange={handleImageChange}
            className="absolute w-0 h-0 overflow-hidden"
          />
          <div className="relative w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-8 w-8 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
              <label htmlFor="profile-image" className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-white bg-blue-500 rounded-full p-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </label>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            {...register("userName", { required: true })}
            className="appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
          />
          {errors.userName && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: true })}
            className="appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className="appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
          />
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
      </div>
      <div>
        <div className="mb-6">
          <label
            htmlFor="bio"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Bio:
          </label>
          <textarea
            id="bio"
            {...register("bio", { required: true })}
            className="appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
          ></textarea>
          {errors.bio && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="hobbies"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Hobbies:
          </label>
          <textarea
            id="hobbies"
            {...register("hobbies", { required: true })}
            className="appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
          ></textarea>
          {errors.hobbies && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="occupation"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Occupation:
          </label>
          <input
            type="text"
            id="occupation"
            {...register("occupation", { required: true })}
            className="appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
          />
          {errors.occupation && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="education"
            className="block text-gray-800 text-sm font-bold mb-2"
          >
            Education:
          </label>
          <input
            type="text"
            id="education"
            {...register("education", { required: true })}
            className="appearance-none border rounded w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
          />
          {errors.education && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="col-span-2 bg-blue-500 text-white px-6 py-3 rounded mt-6"
      >
        Submit
      </button>
    </form>
  </div>
</div>

  );
};

export default DetailsForm;
