import React, { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";
import { normalizeRole } from "../config/roles";

const defaultContextValue = {
  user: null,
  toasts: [],
  notifications: [],
  showSuccess: () => {},
  showError: () => {},
  addNotification: () => {},
  markAllNotificationsAsRead: () => {},
  clearNotifications: () => {},
  login: () => {},
  logout: () => {},
};

const AppContext = createContext(defaultContextValue);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("transitops_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Vehicle TX-9021 completed regular trip to Dallas",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      message: "Driver David Miller is suspended: License investigation",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "Vehicle TX-1188 scheduled for brake replacement in shop",
      time: "2 hours ago",
      read: true,
    },
  ]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message) => addToast(message, "success");
  const showError = (message) => addToast(message, "error");

  const addNotification = (message) => {
    setNotifications((prev) => [
      { id: Date.now(), message, time: "Just now", read: false },
      ...prev,
    ]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleLogin = (userData) => {
    const normalizedUser = {
      ...userData.user,
      role: normalizeRole(userData.user.role),
    };

    setUser(normalizedUser);
    localStorage.setItem("transitops_user", JSON.stringify(normalizedUser));
    localStorage.setItem("transitops_token", userData.token);
    localStorage.setItem("transitops_role", normalizedUser.role);
    showSuccess(`Welcome back, ${normalizedUser.name}!`);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    localStorage.removeItem("transitops_role");
    showSuccess("Logged out successfully");
  };

  return (
    <AppContext.Provider
      value={{
        user,
        toasts,
        notifications,
        showSuccess,
        showError,
        addNotification,
        markAllNotificationsAsRead,
        clearNotifications,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}

      {/* Toast Render Wrapper */}
      <div
        id="toast-wrapper"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-center justify-between text-sm transition-all duration-300 transform translate-y-0 animate-fade-in ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" ? (
                <svg
                  className="w-5 h-5 text-emerald-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 hover:opacity-75 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  return context ?? defaultContextValue;
};
