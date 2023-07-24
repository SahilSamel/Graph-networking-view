import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import POST from "@/api/POST/POST";
import fapp from "@/connections/firebaseconfig";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserId } from "@/state/authStates";

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
  userHandle: string;
  userName: string;
};

type SignUpProps = {
  toggleForm: () => void;
};

export default function SignUp({ toggleForm }: SignUpProps) {
  const router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
  const [isPasswordStrong, setIsPasswordStrong] = useState<boolean>(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>({
    mode: "onChange",
  });
  
  const dispatch = useDispatch();

  useEffect(() => {
    setIsEmailValid(errors.email === undefined);
    setIsPasswordStrong(
      !!watch("password")?.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      )
    );
  }, [errors.email, watch("password")]);

  const renderEmailError = () => {
    if (errors.email) {
      return (
        <span className="text-red-500 text-xs">
          Please enter an email address
        </span>
      );
    } 
    if (!isEmailValid) {
      return (
        <span className="text-red-500 text-xs">
          Please enter a valid email address
        </span>
      );
    }
    return null;
  };

  const renderPasswordErrors = () => {
    if (!errors.email && errors.password && isEmailValid) {
      return <span className="text-red-500 text-xs">Please enter a password</span>;
    } else if (
      !errors.email &&
      watch("password") &&
      !errors.password &&
      !isPasswordStrong &&
      isEmailValid
    ) {
      return (
        <span className="text-red-500 text-xs">
          Password must be at least 8 characters long and contain at least one
          letter, one number, and one special character.
        </span>
      );
    } else if (errors.confirmPassword && watch("password") && isEmailValid && isPasswordStrong && !errors.password) {
      return <span className="text-red-500 text-xs">Passwords do not match</span>;
    }
    return null;
  };
  

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  };

  const [signupError, setSignupError] = useState<string>("");

  // Function to handle clearing signupError
  const clearSignupError = () => {
    setSignupError("");
  };

  // Function to submit the form
  const onSubmit: SubmitHandler<Inputs> = (data: any) => {
    const jsonData = JSON.stringify(data);
    POST("/auth/signup", jsonData, function (err: any, data: any) {
      if (err) {
        setSignupError("User with those credentials might already exist");
        setTimeout(() => {
          setSignupError("");
        }, 5000);
      } else {
        const { uid } = data;
        dispatch(setUserId(uid));
        router.push("/");
      }
    });
  };


  const provider = new GoogleAuthProvider();

  const assignCookies = (uid: any) => {
    const jsonData = JSON.stringify(uid);
    POST("/auth/assignCookies", jsonData, function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        router.push("/");
      }
    });
  };

  const handleGoogleSignIn = () => {
    const auth = getAuth(fapp);
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential === null) return;
        const uid = result.user.uid;
        dispatch(setUserId(uid));
        assignCookies(uid);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="rounded-lg  p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign up</h1>
        {renderEmailError()}
        {renderPasswordErrors()}
        <span className="text-red-500 text-xs">{signupError}</span>
        <form
          className="w-full max-w-sm mx-auto flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="text"
              placeholder="Email"
              {...register("email", { required: true })}
              onChange={(e) => {
                handleEmailChange(e);
              }}
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
          <div className="mb-4">
            <input
              className="appearance-none border rounded w-full py-2 px-3 bg-transparent border-0 leading-tight focus:outline-none focus:border-b-0"
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: true,
                validate: (value) => value === watch("password"),
              })}
            />
          </div>
          <div className="flex flex-col space-y-4 items-center justify-center">
            <button
              className={`flex text-white bg-sky-400 border-2 border-sky-400 font-bold py-2 px-4 rounded hover:bg-transparent hover:text-sky-400 hover:border-2  focus:outline-none focus:shadow-outline ${
                !isEmailValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={!isEmailValid && errors && !isPasswordStrong}
            >
              Sign Up
            </button>
            <div className="registration__form-separator">
              <span className="registration__form-separator-text">
                <div className="p-3 text-slate-500">or</div>
              </span>
            </div>
            <button
              className="flex items-center border border-transparent bg-white text-black font-bold py-2 px-4 rounded-md drop-shadow-lg hover:bg-slate-100 hover:border hover:filter-none focus:outline-none focus:shadow-outline"
              onClick={handleGoogleSignIn}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/graph-networking-app.appspot.com/o/utility%2Fgoogle-icon.svg?alt=media&token=3cf598dd-2cc5-4c83-be58-5e58196b1245"
                alt=""
                style={{
                  maxWidth: "20px",
                  paddingRight: "5px",
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
              Already have an account? Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
