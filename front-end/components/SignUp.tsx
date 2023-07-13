import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import POST from "@/api/POST/POST";
import fapp from "@/connections/firebaseconfig";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
type Inputs = {
  email: string;
  password: string;
  userHandle: string;
  userName: string;
};

type SignUpProps = {
  toggleForm: () => void;
};

export default function SignUp({ toggleForm }: SignUpProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
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

  const submitGoogleuid = (uid: string) => {
    const jsonData = JSON.stringify({ uid: uid });
    POST("/auth/google", jsonData, function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        if (data.result==true) {
          console.log("user exists");
        } else {
          console.log("user does not exist");
        }
      }
    });
  };

  const provider = new GoogleAuthProvider();
  const handleGoogleSignIn = () => {
    const auth = getAuth(fapp);
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential === null) return;
        const token = credential.accessToken;
        const uid = result.user.uid;
        console.log(token);
        console.log(uid);
        submitGoogleuid(uid);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900	">
      <div className="rounded-lg shadow-lg p-6 bg-black	">
        <h1 className="text-3xl font-bold mb-6 text-slate-200	 text-center ">
          Sign up for Twitter
        </h1>
        <form className="w-full max-w-sm mx-auto flex flex-col ">
          <div className="mb-4">
            <label
              className="block text-slate-200	 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-slate-200	 leading-tight focus:outline-none focus:shadow-outline bg-black	"
              type="text"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
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
              className="appearance-none border rounded w-full py-2 px-3 text-slate-200	 leading-tight focus:outline-none focus:shadow-outline bg-black	"
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-slate-200	 text-sm font-bold mb-2"
              htmlFor="userHandle"
            >
              User Handle
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-slate-200	 leading-tight focus:outline-none focus:shadow-outline bg-black	"
              type="text"
              placeholder="User Handle"
              {...register("userHandle", { required: true })}
            />
            {errors.userHandle && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-slate-200	 text-sm font-bold mb-2"
              htmlFor="userHandle"
            >
              User Name
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-slate-200	 leading-tight focus:outline-none focus:shadow-outline bg-black	"
              type="text"
              placeholder="Username"
              {...register("userName", { required: true })}
            />
            {errors.userHandle && (
              <span className="text-red-500 text-xs">
                This field is required
              </span>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onSubmit={handleSubmit(onSubmit)}
            >
              Sign up
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="text-blue-500 hover:text-blue-700 text-sm font-semibold focus:outline-none"
              type="button"
              onClick={toggleForm}
            >
              Already have an account? Log in
            </button>
          </div>
        </form>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={handleGoogleSignIn}
        >
          Google
        </button>
      </div>
    </div>
  );
}
