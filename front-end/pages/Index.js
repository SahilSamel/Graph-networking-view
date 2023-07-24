import { useEffect } from "react";
import { useRouter } from "next/router";
import GET from "@/api/GET/GET";
import POST from "@/api/POST/POST";
import { useSelector } from "react-redux";

export default function Index() {
  const router = useRouter();
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const checkAuth = () => {
      GET("/auth/checkLogin", function (err, data) {
        if (err) {
          router.push("/auth");
        } else {
          const jsonData = JSON.stringify({ userId: userId });
          POST("/auth/dbCheck", jsonData, function (err, data) {
            if (err) {
              router.push("/register");
            } else {
              router.push("/home");
            }
          });
        }
      });
    };

    checkAuth();
  }, []);
  return null;
}
