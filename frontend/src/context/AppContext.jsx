import React, { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";

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
    try {
      const savedUser = localStorage.getItem("transitops_user");

      if (!savedUser || savedUser === "undefined") {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem("transitops_user");
      return null;
    }
  });

  const [toasts, setToasts] = useState([]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Vehicle TX-9021 completed regular trip.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 2,
      message: "Driver license verification pending.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "Maintenance scheduled successfully.",
      time: "2 hours ago",
      read: true,
    },
  ]);

  const addToast = (message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

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
      {
        id: Date.now(),
        message,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      })),
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const login = (data) => {
    setUser(data.user);

    localStorage.setItem("transitops_user", JSON.stringify(data.user));

    localStorage.setItem("transitops_token", data.token);

    localStorage.setItem("transitops_role", data.user.role);

    showSuccess(`Welcome ${data.user.name}`);
  };

  const logout = () => {
    authService.logout();

    setUser(null);

    localStorage.removeItem("transitops_user");
    localStorage.removeItem("transitops_token");
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
        login,
        logout,
      }}
    >
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-lg px-4 py-3 text-sm flex items-center justify-between min-w-[300px]
            ${
              toast.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            <span>{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
};
