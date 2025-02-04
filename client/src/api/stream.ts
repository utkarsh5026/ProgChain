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
  const generator = streamText(url, body);
  for await (const chunk of generator) {
    try {
      const json = JSON.parse(chunk.trim());
      yield json;
    } catch (e) {
      console.error("Failed to parse SSE data:", e);
    }
  }
};

/**
 * Streams raw text data from a Server-Sent Events (SSE) response.
 *
 * This async generator sends a POST request to the provided URL with the supplied
 * request body (converted to JSON). The server is expected to return a text/event-stream.
 * As data is received, each chunk is decoded, cleaned of unnecessary prefixes, and then yielded.
 *
 * @param {string} url - The endpoint URL for the POST request. Must be a non-empty string.
 * @param {Rq} body - The payload to send with the request. It will be serialized as JSON.
 * @yields {string} A processed chunk of text from the SSE stream (with "data:" prefix removed if present).
 * @throws Will throw an error if the URL or body is missing, if the HTTP response status is not OK,
 *         if no response body is available, or if a reader cannot be created.
 */
export const streamText = async function* <Rq extends Record<string, any>>(
  url: string,
  body: Rq
): AsyncGenerator<string> {
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

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  if (!response.body) {
    throw new Error("Response body is null");
  }

  const reader = response.body.getReader();
  if (!reader) {
    throw new Error("No reader available");
  }

  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    let chunk = decoder.decode(value);
    if (chunk.startsWith("data:")) {
      chunk = chunk.slice(5);
    }
    yield chunk;
  }
};
