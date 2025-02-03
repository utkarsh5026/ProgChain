import axios from "axios";

export const API_BASE_URL = "http://localhost:8000";

const caller = axios.create({
  baseURL: API_BASE_URL,
});

export default caller;
