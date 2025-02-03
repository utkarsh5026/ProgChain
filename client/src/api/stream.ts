/**
 * Creates a streaming POST request that yields parsed JSON responses from a Server-Sent Events stream.
 * @param url - The endpoint URL to send the POST request to
 * @param body - The request body object to be sent as JSON
 * @returns An async generator that yields parsed JSON objects from the stream
 * @throws {Error} If the HTTP response is not OK or if the stream cannot be read
 */
export const postStream = async function* <T extends Record<string, any>>(
  url: string,
  body: T
) {
  if (!url) throw new Error("URL is required");
  if (!body) throw new Error("Request body is required");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  if (!reader) throw new Error("No reader available");
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    let chunk = decoder.decode(value);
    if (chunk.startsWith("data:")) chunk = chunk.slice(5);

    chunk = chunk.trim();
    console.log(chunk);
    try {
      const json = JSON.parse(chunk);
      yield json;
    } catch (e) {
      console.error("Failed to parse SSE data:", e);
    }
  }
};
