import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
  // || process.env.NEXT_PUBLIC_BACKEND_URL || "http://10.220.0.8:9000",
  withCredentials: true
})

export { api };

