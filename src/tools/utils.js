import { jwtDecode } from "jwt-decode";
    export const getInforJwt = () => {
        const token = localStorage.getItem("access_token");
      if (!token) return "guest";
    
      try {
        const decoded = jwtDecode(token);
        let inforFromjwt = {
          Id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "guest",
          IsActive: decoded["IsActive"] || false,
          isBlocked: decoded["IsBlocked"] || false,
          isAdvisor: decoded["isAdvisor"] || false, // này là cho teacher nhe
          timeAdvisor: decoded["timeAdvisor"] || "", // này là cho Teacher nhe
        }
        return inforFromjwt;
      } catch (error) {
        console.error("Invalid token:", error);
        return "guest";
      }
    }
