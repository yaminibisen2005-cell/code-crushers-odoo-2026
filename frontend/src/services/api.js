import axios from "axios";

// Initial pre-populated data if not already present in localStorage
const INITIAL_VEHICLES = [
  { id: 'v1', registrationNo: 'TX-9021', name: 'Volvo FH16', type: 'Heavy Truck', capacity: '25 Tons', odometer: 120500, cost: 145000, status: 'Available' },
  { id: 'v2', registrationNo: 'TX-4055', name: 'Tesla Semi', type: 'Electric Semi', capacity: '20 Tons', odometer: 45200, cost: 180000, status: 'On Trip' },
  { id: 'v3', registrationNo: 'TX-1188', name: 'Kenworth T680', type: 'Heavy Truck', capacity: '22 Tons', odometer: 89100, cost: 115000, status: 'In Shop' },
  { id: 'v4', registrationNo: 'TX-8833', name: 'Isuzu NPR', type: 'Box Truck', capacity: '5 Tons', odometer: 15000, cost: 45000, status: 'Available' },
  { id: 'v5', registrationNo: 'TX-7744', name: 'Ford Transit', type: 'Cargo Van', capacity: '2 Tons', odometer: 62000, cost: 35000, status: 'Retired' }
];

const INITIAL_DRIVERS = [
  { id: 'd1', name: 'John Doe', licenseNo: 'DL-99212', category: 'Class A CDL', expiryDate: '2027-12-15', phone: '+1-555-0192', safetyScore: 98, status: 'Available' },
  { id: 'd2', name: 'Sarah Connor', licenseNo: 'DL-10492', category: 'Class B CDL', expiryDate: '2025-04-10', phone: '+1-555-0183', safetyScore: 92, status: 'Available' }, // License Expired
  { id: 'd3', name: 'Michael Scott', licenseNo: 'DL-55219', category: 'Class A CDL', expiryDate: '2028-09-20', phone: '+1-555-0144', safetyScore: 74, status: 'On Trip' },
  { id: 'd4', name: 'David Miller', licenseNo: 'DL-33829', category: 'Standard Class C', expiryDate: '2024-02-18', phone: '+1-555-0125', safetyScore: 85, status: 'Suspended' }, // Suspended + Expired
  { id: 'd5', name: 'Emma Watson', licenseNo: 'DL-77218', category: 'Class B CDL', expiryDate: '2026-11-05', phone: '+1-555-0166', safetyScore: 95, status: 'Available' }
];

const INITIAL_TRIPS = [
  { id: 't1', source: 'Houston, TX', destination: 'Dallas, TX', vehicleId: 'v2', driverId: 'd3', cargoWeight: 12000, distance: 240, status: 'Dispatched', date: '2026-07-11' },
  { id: 't2', source: 'Chicago, IL', destination: 'Detroit, MI', vehicleId: 'v1', driverId: 'd1', cargoWeight: 8000, distance: 280, status: 'Completed', date: '2026-07-10' },
  { id: 't3', source: 'Denver, CO', destination: 'Phoenix, AZ', vehicleId: 'v4', driverId: 'd5', cargoWeight: 4000, distance: 800, status: 'Completed', date: '2026-07-08' }
];

const INITIAL_MAINTENANCE = [
  { id: 'm1', vehicleId: 'v3', type: 'Brake Replacement', date: '2026-07-05', cost: 1200, notes: 'Full front and rear brake shoe replacement', status: 'In Progress' },
  { id: 'm2', vehicleId: 'v1', type: 'Oil Change', date: '2026-07-01', cost: 150, notes: 'Routine oil and filter replacement', status: 'Completed' },
  { id: 'm3', vehicleId: 'v4', type: 'Tire Rotation', date: '2026-06-25', cost: 350, notes: '4-wheel alignment and rotation', status: 'Completed' }
];

const INITIAL_FUEL = [
  { id: 'f1', vehicleId: 'v1', date: '2026-07-10', liters: 120, cost: 180, expenseType: 'Fuel Fill', amount: 180 },
  { id: 'f2', vehicleId: 'v2', date: '2026-07-09', liters: 95, cost: 142.5, expenseType: 'Fuel Fill', amount: 142.5 },
  { id: 'f3', vehicleId: 'v3', date: '2026-07-08', liters: 0, cost: 0, expenseType: 'Tolls', amount: 45 },
  { id: 'f4', vehicleId: 'v4', date: '2026-07-07', liters: 50, cost: 75, expenseType: 'Fuel Fill', amount: 75 },
  { id: 'f5', vehicleId: 'v1', date: '2026-07-06', liters: 0, cost: 0, expenseType: 'Permits', amount: 120 }
];

// Setup default localStorage keys if empty
const initLocalStorage = () => {
  if (!localStorage.getItem('vtrackora_vehicles')) {
    localStorage.setItem('vtrackora_vehicles', JSON.stringify(INITIAL_VEHICLES));
  }
  if (!localStorage.getItem('vtrackora_drivers')) {
    localStorage.setItem('vtrackora_drivers', JSON.stringify(INITIAL_DRIVERS));
  }
  if (!localStorage.getItem('vtrackora_trips')) {
    localStorage.setItem('vtrackora_trips', JSON.stringify(INITIAL_TRIPS));
  }
  if (!localStorage.getItem('vtrackora_maintenance')) {
    localStorage.setItem('vtrackora_maintenance', JSON.stringify(INITIAL_MAINTENANCE));
  }
  if (!localStorage.getItem('vtrackora_fuel')) {
    localStorage.setItem('vtrackora_fuel', JSON.stringify(INITIAL_FUEL));
  }
};

initLocalStorage();

// Helper functions for Database interactions
const getDb = (key) => JSON.parse(localStorage.getItem(`vtrackora_${key}`) || '[]');
const saveDb = (key, data) => localStorage.setItem(`vtrackora_${key}`, JSON.stringify(data));

// Create Axios Mock Client using a custom Adapter
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vtrackora_token");

    const { url, method, data: rawData } = config;
    const parsedData = rawData ? JSON.parse(rawData) : null;

    // Pattern matching for API endpoints
    if (url.startsWith('/api/auth/login')) {
      if (method === 'post' || method === 'POST') {
        const { email, password } = parsedData;
        if (email === 'admin@vtrackora.com' && password === 'admin123') {
          return {
            data: {
              token: 'vtrackora-jwt-token-xyz',
              user: { email, name: 'Alex Harrison', role: 'Operations Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60' }
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          };
        } else {
          return Promise.reject({
            response: {
              status: 401,
              data: { message: 'Invalid credentials. Use admin@vtrackora.com / admin123' }
            }
          });
        }
      }
    }

    // VEHICLES ENDPOINT
    if (url === '/api/vehicles') {
      const list = getDb('vehicles');
      if (method === 'get' || method === 'GET') {
        return { data: list, status: 200, statusText: 'OK', headers: {}, config };
      }
      if (method === 'post' || method === 'POST') {
        // Create vehicle
        const newVehicle = { id: 'v_' + Date.now(), ...parsedData };
        list.push(newVehicle);
        saveDb('vehicles', list);
        return { data: newVehicle, status: 201, statusText: 'Created', headers: {}, config };
      }
    }

    if (url.startsWith('/api/vehicles/')) {
      const id = url.split('/').pop();
      let list = getDb('vehicles');
      const index = list.findIndex(v => v.id === id);

      if (method === 'put' || method === 'PUT') {
        if (index !== -1) {
          list[index] = { ...list[index], ...parsedData };
          saveDb('vehicles', list);
          return { data: list[index], status: 200, statusText: 'OK', headers: {}, config };
        }
        return Promise.reject({ response: { status: 404, data: { message: 'Vehicle not found' } } });
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("vtrackora_token");
      localStorage.removeItem("vtrackora_user");
    }

    return Promise.reject(error);
  },
);

export default api;
