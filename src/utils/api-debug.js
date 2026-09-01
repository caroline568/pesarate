/**
 * Debug utility for checking API connectivity
 * Use this to diagnose "Can't reach the PesaRate server" issues
 */

export async function checkApiHealth() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  
  try {
    const response = await fetch(`${apiUrl}/health`, { 
      method: "GET",
      mode: "cors",
    });
    
    if (response.ok) {
      return { 
        status: "ok", 
        message: `Backend is reachable at ${apiUrl}`,
        apiUrl 
      };
    } else {
      return { 
        status: "error", 
        message: `Backend returned status ${response.status}`,
        apiUrl,
        httpStatus: response.status
      };
    }
  } catch (error) {
    return { 
      status: "unreachable", 
      message: `Cannot reach backend at ${apiUrl}. Make sure VITE_API_URL is set correctly.`,
      apiUrl,
      error: error.message,
      env: {
        VITE_API_URL: import.meta.env.VITE_API_URL,
        MODE: import.meta.env.MODE,
      }
    };
  }
}

/**
 * Log API configuration for debugging
 */
export function logApiConfig() {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  console.log("=== PesaRate API Configuration ===");
  console.log(`API URL: ${apiUrl}`);
  console.log(`Mode: ${import.meta.env.MODE}`);
  console.log(`VITE_API_URL env: ${import.meta.env.VITE_API_URL || "(not set - using default)"}`);
  console.log("==================================");
}
