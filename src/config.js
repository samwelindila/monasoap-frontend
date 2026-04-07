

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_URL}/uploads/${filename}`;
};

export default API_URL;