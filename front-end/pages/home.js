import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Graph from "@/components/Graph.tsx";
import GET from "@/api/GET/GET";
import Mainlayout from "@/layout/Mainlayout.js"; // Assuming you have imported Mainlayout correctly

const Home = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      GET("/auth/checkLogin", function (err, data) {
        if (err) {
          router.push("/auth");
        } else {
          setIsLoggedIn(true);
        }
      });
    };

    checkAuth();
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <Mainlayout middleComponent={Graph} />
      ) : (
        <div>Loading...</div> // or any loading indicator while the authentication check is in progress
      )}
    </>
  );
};

export default Home;

