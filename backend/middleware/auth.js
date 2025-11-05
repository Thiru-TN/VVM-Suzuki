import jwt from "jsonwebtoken";

// Read debug flag from .env (default: false)
const DEBUG_AUTH = process.env.DEBUG_AUTH === "true";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (DEBUG_AUTH) {
    console.log("[AUTH] Incoming request headers:", req.headers);
  }

  if (!authHeader) {
    if (DEBUG_AUTH) console.log("[AUTH] No Authorization header provided.");
    return res.status(401).json({ 
      success: false,
      message: "Authentication required. Please sign in." 
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    if (DEBUG_AUTH) console.log("[AUTH] Invalid token format:", authHeader);
    return res.status(401).json({ 
      success: false,
      message: "Invalid token format. Please sign in again." 
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      if (DEBUG_AUTH) console.log("[AUTH] Token missing after split.");
      return res.status(401).json({ 
        success: false,
        message: "Authentication token missing. Please sign in." 
      });
    }

    if (DEBUG_AUTH) console.log("[AUTH] Verifying token...");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (DEBUG_AUTH) console.log("[AUTH] Token decoded:", decoded);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || "user",
    };

    if (DEBUG_AUTH) console.log("[AUTH] User attached to request:", req.user);

    next();
  } catch (err) {
    if (DEBUG_AUTH) console.error("[AUTH] Error verifying token:", err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Session expired. Please sign in again." 
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Invalid authentication. Please sign in again." 
      });
    } else {
      return res.status(401).json({ 
        success: false,
        message: "Authentication failed. Please sign in." 
      });
    }
  }
};

export const isAdmin = (req, res, next) => {
  if (DEBUG_AUTH) console.log("[AUTH] Checking admin role for user:", req.user);

  if (req.user?.role !== "admin") {
    if (DEBUG_AUTH) console.log("[AUTH] Access denied. User role:", req.user?.role);
    return res.status(403).json({ 
      success: false,
      message: "Admin access required" 
    });
  }

  if (DEBUG_AUTH) console.log("[AUTH] Admin access granted.");
  next();
};
