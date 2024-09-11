import axios from "axios";

const API_BASE_URL = "http://localhost:8000/topics"; // Replace with your actual backend URL

/**
 * Generates topics based on a main topic and optional context.
 *
 * @async
 * @function generateTopics
 * @param {string} mainTopic - The primary topic for which to generate related topics.
 * @param {string[]} [context=[]] - Optional array of context strings to provide additional information for topic generation.
 * @returns {Promise<Object>} A promise that resolves to the generated topics.
 * @throws {Error} If the API request fails.
 *
 * @example
 * const topics = await generateTopics('JavaScript', ['Web Development', 'Frontend']);
 */
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
