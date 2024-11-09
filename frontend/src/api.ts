import axios from "axios";

const api = axios.create({
  baseURL: "http://10.220.0.8:9000",
  withCredentials: true
})

export { api };

