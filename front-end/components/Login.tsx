import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import POST from "@/api/POST/POST";
import { setUserId } from "@/state/authStates";

type Inputs = {
  email: string;
  password: string;
};

type LoginProps = {
  toggleForm: () => void;
};

const Login = ({ toggleForm }: LoginProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [showUserCredentialsError, setShowUserCredentialsError] = useState<boolean>(false);

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
        setShowUserCredentialsError(true);
        setTimeout(() => {
          setShowUserCredentialsError(false);
          setErrorMessage("");
        }, 5000); // 5000 milliseconds (5 seconds) timeout to hide the error
      } else {
        const { uid } = data;
        dispatch(setUserId(uid));
        router.push("/");
      }
    });
  };

  const renderEmailError = () => {
    if (errors.email && errors.email.type === "required") {
      return (
        <div className="w-full max-w-sm mx-auto mt-1">
          <span className="text-red-500 text-xs">This field is required</span>
        </div>
      );
    }
    if (!errors.email && !isEmailValid) {
      return (
        <div className="w-full max-w-sm mx-auto mt-1">
          <span className="text-red-500 text-xs">
            Please enter a valid email address
          </span>
        </div>
      );
    }
    return null;
  };

  const renderPasswordError = () => {
    if (errors.password && !errors.email && isEmailValid) {
      return (
        <div className="w-full max-w-sm mx-auto mt-1">
          <span className="text-red-500 text-xs">
            You forgot to enter your password
          </span>
        </div>
      );
    }
    return null;
  };

  const renderUserCredentialsError = () => {
    if (showUserCredentialsError && !errors.email && !errors.password) {
      return (
        <p className="text-red-500 text-xs mb-4">{errorMessage}</p>
      );
    }
    return null;
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
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg  p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>
        {renderEmailError()}
        {renderPasswordError()}
        {renderUserCredentialsError()}
        <form
          className="w-full max-w-sm mx-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="text"
              placeholder="Email"
              {...register("email", { required: true })}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
          </div>
          <div className="flex flex-col space-y-4 items-center justify-center">
            <button
              className={`flex text-white bg-sky-400 border-2 border-sky-400 font-bold py-2 px-4 rounded hover:bg-transparent hover:text-sky-400 hover:border-2  focus:outline-none focus:shadow-outline ${
                !isEmailValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={!isEmailValid}
            >
              Log in
            </button>
            <div className="registration__form-separator"><span className="registration__form-separator-text"><div className="p-3 text-slate-500">or</div></span></div>
            <button
              className="flex items-center border border-transparent bg-white text-black font-bold py-2 px-4 rounded-md drop-shadow-lg hover:bg-slate-100 hover:border hover:filter-none focus:outline-none focus:shadow-outline"
              type="submit"
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/graph-networking-app.appspot.com/o/utility%2Fgoogle-icon.svg?alt=media&token=3cf598dd-2cc5-4c83-be58-5e58196b1245"
                alt=""
                style={{
                  maxWidth:"20px",
                  paddingRight:"5px"
                }}
              />
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
