export const getApiUrl = (path) => {
  const hostname = window.location.hostname;
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.");
  const baseUrl = isLocal ? `http://${hostname}:5000` : "https://groovix-78ic.onrender.com";
  // remove leading slash if path has it
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};
