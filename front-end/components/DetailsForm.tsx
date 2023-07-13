import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/router'
import POST from '@/api/POST/POST'
import { useSelector } from 'react-redux'


const DetailsForm = () => {
  const userId = useSelector((state:any) => state.auth.userId);

  type FormData ={
    uid: string;
    profileImageUrl: string;
    username: string;
    name: string;
    email: string;
    bio: string;
    hobbies: string;
    occupation: string;
    education: string;

  }
  const router = useRouter();

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    data.uid = userId;
    const jsonData = JSON.stringify(data);
    POST("/auth/createProfile", jsonData, function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        const { uid } = data;
        router.push("/home");
      }
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  return (
   <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">User Details Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="profileImageUrl" className="block mb-2">
            Profile Image URL:
          </label>
          <input
            type="text"
            id="profileImageUrl"
            {...register('profileImageUrl', { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          {errors.profileImageUrl && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Username:
          </label>
          <input
            type="text"
            id="username"
            {...register('username', { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          {errors.username && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            {...register('email', { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          {errors.email && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block mb-2">
            Bio:
          </label>
          <textarea
            id="bio"
            {...register('bio', { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          ></textarea>
          {errors.bio && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="hobbies" className="block mb-2">
            Hobbies:
          </label>
          <textarea
            id="hobbies"
            {...register('hobbies', { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          ></textarea>
          {errors.hobbies && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="occupation" className="block mb-2">
            Occupation:
          </label>
          <input
            type="text"
            id="occupation"
            {...register('occupation', { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          {errors.occupation && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="education" className="block mb-2">
            Education:
          </label>
          <input
            type="text"
            id="education"
            {...register('education', { required: true })}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
          {errors.education && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default DetailsForm
