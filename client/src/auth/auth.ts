
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"; // backend port

const API_URL =  `${baseUrl}/api/auth`; // backend port

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    try {
      const data = await res.json();
      throw new Error(data?.message || data?.error || "Login failed");
    } catch (e) {
      const text = await res.text().catch(() => null);
      throw new Error(text || "Login failed");
    }
  }
  try {
    return await res.json();
  } catch {
    const text = await res.text().catch(() => null);
    throw new Error(text || "Invalid JSON response from server");
  }
};

export const signup = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    try {
      const data = await res.json();
      throw new Error(data?.message || data?.error || "Signup failed");
    } catch (e) {
      const text = await res.text().catch(() => null);
      throw new Error(text || "Signup failed");
    }
  }
  try {
    return await res.json();
  } catch {
    const text = await res.text().catch(() => null);
    throw new Error(text || "Invalid JSON response from server");
  }
};

export const googleLogin = async (googleToken: string) => {
  const res = await fetch(`${API_URL}/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential: googleToken }),
  });
  if (!res.ok) {
    try {
      const data = await res.json();
      throw new Error(data?.message || data?.error || "Google login failed");
    } catch (e) {
      const text = await res.text().catch(() => null);
      throw new Error(text || "Google login failed");
    }
  }
  try {
    return await res.json();
  } catch {
    const text = await res.text().catch(() => null);
    throw new Error(text || "Invalid JSON response from server");
  }
};




export const adminLogin = async (email: string, password: string, adminSecret: string) => {
  try {
   
    const response = await fetch(`${API_URL}/api/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
      body: JSON.stringify({ email, password, adminSecret }), 
    });

    const data = await response.json();

    // 2. Agar backend ne error diya (jaise wrong password), toh usko throw karo
    if (!response.ok) {
      throw new Error(data.message || data.error || "Login failed");
    }

   
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    
    
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error: any) {
    throw error;
  }
};



export const adminSignup = async (
  name: string,
  email: string,
  password: string,
  adminSecret: string
) => {
  const res = await fetch(`${API_URL}/admin/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, adminSecret }),
  });

  if (!res.ok) {
    try {
      const data = await res.json();
      throw new Error(data?.message || data?.error || "Admin signup failed");
    } catch {
      const text = await res.text().catch(() => null);
      throw new Error(text || "Admin signup failed");
    }
  }

  try {
    return await res.json();
  } catch {
    const text = await res.text().catch(() => null);
    throw new Error(text || "Invalid JSON response from server");
  }
};
