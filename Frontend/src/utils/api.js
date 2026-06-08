export const getApiUrl = (path) => {
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const baseUrl = isLocal ? "http://localhost:5000" : "https://groovix-78ic.onrender.com";
  // remove leading slash if path has it
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};
