import axios from "axios";

const apiAxios = axios.create({
  baseURL: "http://localhost:4000/api/",
});

export default apiAxios;
