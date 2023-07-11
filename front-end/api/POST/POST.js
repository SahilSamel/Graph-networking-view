import axios from "axios";
import {serverUrl} from "@/constants/appConstant"


const post = async (endpoint,data,func) => {
    try {
      const response = await axios.post(serverUrl + endpoint, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      const jsonData = response.data;
      func(null, jsonData);
    } catch (error) {
      func(error, "");
    }
  };

export default post;