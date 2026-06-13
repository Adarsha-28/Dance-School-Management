export const getApiUrl = (path) => {
  const baseUrl = "https://groovix-78ic.onrender.com";
  // remove leading slash if path has it
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};
