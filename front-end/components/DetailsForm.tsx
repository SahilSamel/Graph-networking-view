import React from 'react'

const DetailsForm = () => {
  interface FormData {
    profileImageUrl: string;
    username: string;
    name: string;
    email: string;
    bio: string;
    hobbies: string;
    occupation: string;
    education: string;
  }

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    const jsonData = JSON.stringify(data);
    POST("/auth/signup", jsonData, function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        const { uid } = data;
        router.push("/");
      }
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <div>
      <h1>User Details Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="profileImageUrl">Profile Image URL:</label>
          <input
            type="text"
            id="profileImageUrl"
            {...register('profileImageUrl', { required: true })}
          />
          {errors.profileImageUrl && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            {...register('username', { required: true })}
          />
          {errors.username && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            {...register('name', { required: true })}
          />
          {errors.name && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: true })}
          />
          {errors.email && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" {...register('bio', { required: true })}></textarea>
          {errors.bio && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="hobbies">Hobbies:</label>
          <textarea
            id="hobbies"
            {...register('hobbies', { required: true })}
          ></textarea>
          {errors.hobbies && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="occupation">Occupation:</label>
          <input
            type="text"
            id="occupation"
            {...register('occupation', { required: true })}
          />
          {errors.occupation && <span>This field is required</span>}
        </div>
        <div>
          <label htmlFor="education">Education:</label>
          <input
            type="text"
            id="education"
            {...register('education', { required: true })}
          />
          {errors.education && <span>This field is required</span>}
        </div>
        <button type="submit">Submit</button>
      </form>
  )
}

export default DetailsForm
