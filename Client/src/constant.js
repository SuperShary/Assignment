export const constant = {
    // Fallback to a hardcoded URL if environment variable is not set
    baseUrl: process.env.REACT_APP_BASE_URL || "http://localhost:5001/"
}

console.log('API Base URL:', process.env.REACT_APP_BASE_URL || "http://localhost:5001/");
