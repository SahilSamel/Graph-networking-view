import axios from "axios";
import { serverUrl } from "@/constants/appConstant";

const GET = async (endpoint, func) => {
  try {
    const response = await axios.get(serverUrl + endpoint, {
      headers: {
        "content-type": "application/json"
      },
      withCredentials: true 
    });
    const jsonData = response.data;
    func(null, jsonData);
  } catch (error) {
    func(error, "");
  }
};

export default GET;