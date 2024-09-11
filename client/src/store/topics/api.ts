import axios from "axios";

const API_BASE_URL = "http://localhost:8000/topics"; // Replace with your actual backend URL

export const generateTopics = async (
  mainTopic: string,
  context: string[] = []
) => {
  const response = await axios.post(`${API_BASE_URL}/generate`, {
    main_topic: mainTopic,
    context: context,
  });

  console.log(response.data);
  return response.data.topics;
};
