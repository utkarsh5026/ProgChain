import axios from "axios";

const caller = axios.create({
  baseURL: "http://localhost:8000",
});

export default caller;
