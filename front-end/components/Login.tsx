
import { useState, useEffect } from "react";
;
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import POST from "@/api/POST/POST";
type Inputs = {
  email: string;
  password: string;
};

type LoginProps = {
  toggleForm: () => void;
};

const Login = ({ toggleForm }: LoginProps) => {
  const router = useRouter();
 
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const jsonData = JSON.stringify(data);
    POST("/auth/signIn", jsonData, function (err: any, data: any) {
      if (err) {
        setErrorMessage("The user with these credentials might not exist");
      } else {
        const { uid, userHandle } = data;
  
        router.push("/");
      }
    });
  };

  useEffect(() => {
    if (errors.email) {
      setIsEmailValid(false);
    }
  }, [errors.email]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900	">
      <div className="rounded-lg shadow-lg p-6 bg-black">
        <h1 className="text-3xl font-bold mb-6 text-slate-200	text-center">
          Log in to Twitter
        </h1>
        {errorMessage && (
          <p className="text-red-500 text-xs mb-4">{errorMessage}</p>
        )}
        <form
          className="w-full max-w-sm mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <label
              className="block text-slate-200 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-slate-200 leading-tight bg-black focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Email"
              {...register("email", { required: true })}
              onChange={handleEmailChange}
            />
            {errors.email && errors.email.type === "required" && (
              <div className="w-full max-w-sm mx-auto mt-1">
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              </div>
            )}
            {!errors.email && !isEmailValid && (
              <div className="w-full max-w-sm mx-auto mt-1">
                <span className="text-red-500 text-xs">
                  Please enter a valid email address
                </span>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-slate-200	 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-slate-200	 leading-tight focus:outline-none focus:shadow-outline bg-black"
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <div className="w-full max-w-sm mx-auto mt-4">
                <span className="text-red-500 text-xs">
                  This field is required
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !isEmailValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={!isEmailValid}
            >
              Log in
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Google
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="text-blue-500 hover:text-blue-700 text-sm font-semibold focus:outline-none"
              type="button"
              onClick={toggleForm}
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;