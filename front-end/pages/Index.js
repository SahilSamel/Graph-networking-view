import { useEffect } from "react";
import { useRouter } from "next/router";
import GET from "@/api/GET/GET";
import Detailsform from "@/components/Detailsform";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      GET("/auth/checkLogin", function (err, data) {
        if (err) {
          router.push("/auth");
        } else {
            GET("/auth/dbCheck", function(err, data){
                if(err){
                    return <Detailsform />
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