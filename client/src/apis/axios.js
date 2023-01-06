import axios from "axios";

const apiAxios = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default apiAxios;
