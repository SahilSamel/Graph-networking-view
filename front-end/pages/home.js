import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Graph from "@/components/Graph.tsx";
import GET from "@/api/GET/GET";
import Leftbar from "@/components/Leftbar";

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
        <Graph />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Home;

