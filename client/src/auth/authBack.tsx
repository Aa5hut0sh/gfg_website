//authBack.tsx se protected routes ko validate karne ka kaam karta hain.
//jaise ki login  ke bina koi entry nhi hogi 



import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext";

const AuthBack = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default AuthBack;

