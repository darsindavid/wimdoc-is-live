function getStoredToken() {
  try {
    const raw = localStorage.getItem("wimdoc-auth");
    if (!raw) return "";
    return JSON.parse(raw).token || "";
  } catch {
    return "";
  }
}

function createApiClient() {
  const BASE_URL =
    import.meta.env.VITE_API_URL?.replace(/\/+$/, "") ||
    "http://localhost:4000/api";

  async function request(method: string, endpoint: string, body?: any) {
    const token = getStoredToken();

    const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers: any = {
      "Content-Type": "application/json",
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errorMessage = `API Error (${res.status})`;
      try {
        const data = await res.json();
        if (data?.error) errorMessage = data.error;
      } catch {}
      throw new Error(errorMessage);
    }

    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  return {
    get: (endpoint: string) => request("GET", endpoint),
    post: (endpoint: string, body?: any) => request("POST", endpoint, body),
    put: (endpoint: string, body?: any) => request("PUT", endpoint, body),
    delete: (endpoint: string) => request("DELETE", endpoint),
  };
}

export const api = createApiClient();