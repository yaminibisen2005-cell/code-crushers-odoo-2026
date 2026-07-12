import axios from 'axios';

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
  if (!localStorage.getItem('transitops_vehicles')) {
    localStorage.setItem('transitops_vehicles', JSON.stringify(INITIAL_VEHICLES));
  }
  if (!localStorage.getItem('transitops_drivers')) {
    localStorage.setItem('transitops_drivers', JSON.stringify(INITIAL_DRIVERS));
  }
  if (!localStorage.getItem('transitops_trips')) {
    localStorage.setItem('transitops_trips', JSON.stringify(INITIAL_TRIPS));
  }
  if (!localStorage.getItem('transitops_maintenance')) {
    localStorage.setItem('transitops_maintenance', JSON.stringify(INITIAL_MAINTENANCE));
  }
  if (!localStorage.getItem('transitops_fuel')) {
    localStorage.setItem('transitops_fuel', JSON.stringify(INITIAL_FUEL));
  }
};

initLocalStorage();

// Helper functions for Database interactions
const getDb = (key) => JSON.parse(localStorage.getItem(`transitops_${key}`) || '[]');
const saveDb = (key, data) => localStorage.setItem(`transitops_${key}`, JSON.stringify(data));

// Create Axios Mock Client using a custom Adapter
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Configure custom adapter
api.defaults.adapter = async (config) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const { url, method, data: rawData } = config;
  const parsedData = rawData ? JSON.parse(rawData) : null;

  // Pattern matching for API endpoints
  if (url.startsWith('/api/auth/login')) {
    if (method === 'post' || method === 'POST') {
      const { email, password } = parsedData;
      if (email === 'admin@transitops.com' && password === 'admin123') {
        return {
          data: {
            token: 'transitops-jwt-token-xyz',
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
            data: { message: 'Invalid credentials. Use admin@transitops.com / admin123' }
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

    if (method === 'delete' || method === 'DELETE') {
      if (index !== -1) {
        const deleted = list[index];
        list = list.filter(v => v.id !== id);
        saveDb('vehicles', list);
        return { data: deleted, status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Vehicle not found' } } });
    }
  }

  // DRIVERS ENDPOINT
  if (url === '/api/drivers') {
    const list = getDb('drivers');
    if (method === 'get' || method === 'GET') {
      return { data: list, status: 200, statusText: 'OK', headers: {}, config };
    }
    if (method === 'post' || method === 'POST') {
      const newDriver = { id: 'd_' + Date.now(), ...parsedData };
      list.push(newDriver);
      saveDb('drivers', list);
      return { data: newDriver, status: 201, statusText: 'Created', headers: {}, config };
    }
  }

  if (url.startsWith('/api/drivers/')) {
    const id = url.split('/').pop();
    let list = getDb('drivers');
    const index = list.findIndex(d => d.id === id);

    if (method === 'put' || method === 'PUT') {
      if (index !== -1) {
        list[index] = { ...list[index], ...parsedData };
        saveDb('drivers', list);
        return { data: list[index], status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Driver not found' } } });
    }

    if (method === 'delete' || method === 'DELETE') {
      if (index !== -1) {
        const deleted = list[index];
        list = list.filter(d => d.id !== id);
        saveDb('drivers', list);
        return { data: deleted, status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Driver not found' } } });
    }
  }

  // TRIPS ENDPOINT
  if (url === '/api/trips') {
    const list = getDb('trips');
    if (method === 'get' || method === 'GET') {
      return { data: list, status: 200, statusText: 'OK', headers: {}, config };
    }
    if (method === 'post' || method === 'POST') {
      const { source, destination, vehicleId, driverId, cargoWeight, distance } = parsedData;

      // Real business validation to simulate Backend Errors
      const vehicles = getDb('vehicles');
      const drivers = getDb('drivers');
      const vehicle = vehicles.find(v => v.id === vehicleId);
      const driver = drivers.find(d => d.id === driverId);

      const errors = [];
      if (!source) errors.push("Source location is required.");
      if (!destination) errors.push("Destination location is required.");
      if (!vehicleId) errors.push("Please select a vehicle.");
      if (!driverId) errors.push("Please select a driver.");

      if (vehicle) {
        if (vehicle.status === 'In Shop') errors.push(`Vehicle ${vehicle.registrationNo} is currently in shop.`);
        if (vehicle.status === 'Retired') errors.push(`Vehicle ${vehicle.registrationNo} is retired.`);
        if (vehicle.status === 'On Trip') errors.push(`Vehicle ${vehicle.registrationNo} is already on an active trip.`);
      }
      if (driver) {
        if (driver.status === 'Suspended') errors.push(`Driver ${driver.name} is suspended.`);
        if (driver.status === 'On Trip') errors.push(`Driver ${driver.name} is already assigned to a running trip.`);
        const expiry = new Date(driver.expiryDate);
        const today = new Date('2026-07-11');
        if (expiry < today) errors.push(`Driver ${driver.name}'s commercial license expired on ${driver.expiryDate}.`);
      }

      if (errors.length > 0) {
        return Promise.reject({
          response: {
            status: 400,
            data: { message: 'Dispatch Validation Failed', errors }
          }
        });
      }

      const newTrip = {
        id: 't_' + Date.now(),
        source,
        destination,
        vehicleId,
        driverId,
        cargoWeight: parseFloat(cargoWeight) || 0,
        distance: parseFloat(distance) || 0,
        status: 'Dispatched',
        date: '2026-07-11'
      };

      // Update vehicle and driver statuses to 'On Trip'
      if (vehicle) vehicle.status = 'On Trip';
      if (driver) driver.status = 'On Trip';
      saveDb('vehicles', vehicles);
      saveDb('drivers', drivers);

      list.push(newTrip);
      saveDb('trips', list);
      return { data: newTrip, status: 201, statusText: 'Created', headers: {}, config };
    }
  }

  if (url.startsWith('/api/trips/')) {
    const id = url.split('/').pop();
    let list = getDb('trips');
    const index = list.findIndex(t => t.id === id);

    if (method === 'put' || method === 'PUT') {
      if (index !== -1) {
        const oldTrip = list[index];
        const newTrip = { ...oldTrip, ...parsedData };

        // Handle vehicle/driver status release if trip completed or cancelled
        if (newTrip.status === 'Completed' || newTrip.status === 'Cancelled') {
          const vehicles = getDb('vehicles');
          const drivers = getDb('drivers');
          const v = vehicles.find(item => item.id === oldTrip.vehicleId);
          const d = drivers.find(item => item.id === oldTrip.driverId);
          if (v && v.status === 'On Trip') v.status = 'Available';
          if (d && d.status === 'On Trip') d.status = 'Available';
          saveDb('vehicles', vehicles);
          saveDb('drivers', drivers);
        }

        list[index] = newTrip;
        saveDb('trips', list);
        return { data: list[index], status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Trip not found' } } });
    }

    if (method === 'delete' || method === 'DELETE') {
      if (index !== -1) {
        const deleted = list[index];
        list = list.filter(t => t.id !== id);
        saveDb('trips', list);
        return { data: deleted, status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Trip not found' } } });
    }
  }

  // MAINTENANCE ENDPOINT
  if (url === '/api/maintenance') {
    const list = getDb('maintenance');
    if (method === 'get' || method === 'GET') {
      return { data: list, status: 200, statusText: 'OK', headers: {}, config };
    }
    if (method === 'post' || method === 'POST') {
      const newMaint = { id: 'm_' + Date.now(), ...parsedData };
      list.push(newMaint);
      saveDb('maintenance', list);

      // If status is 'In Progress' or 'Pending', change vehicle status to 'In Shop'
      if (newMaint.status === 'In Progress' || newMaint.status === 'Pending') {
        const vehicles = getDb('vehicles');
        const v = vehicles.find(item => item.id === newMaint.vehicleId);
        if (v) v.status = 'In Shop';
        saveDb('vehicles', vehicles);
      } else if (newMaint.status === 'Completed') {
        const vehicles = getDb('vehicles');
        const v = vehicles.find(item => item.id === newMaint.vehicleId);
        if (v && v.status === 'In Shop') v.status = 'Available';
        saveDb('vehicles', vehicles);
      }

      return { data: newMaint, status: 201, statusText: 'Created', headers: {}, config };
    }
  }

  if (url.startsWith('/api/maintenance/')) {
    const id = url.split('/').pop();
    let list = getDb('maintenance');
    const index = list.findIndex(m => m.id === id);

    if (method === 'put' || method === 'PUT') {
      if (index !== -1) {
        list[index] = { ...list[index], ...parsedData };
        saveDb('maintenance', list);

        // Update vehicle status based on maintenance status
        const vehicles = getDb('vehicles');
        const v = vehicles.find(item => item.id === list[index].vehicleId);
        if (v) {
          if (list[index].status === 'Completed') {
            if (v.status === 'In Shop') v.status = 'Available';
          } else {
            v.status = 'In Shop';
          }
          saveDb('vehicles', vehicles);
        }

        return { data: list[index], status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Log not found' } } });
    }

    if (method === 'delete' || method === 'DELETE') {
      if (index !== -1) {
        const deleted = list[index];
        list = list.filter(m => m.id !== id);
        saveDb('maintenance', list);
        return { data: deleted, status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Log not found' } } });
    }
  }

  // FUEL ENDPOINT
  if (url === '/api/fuel') {
    const list = getDb('fuel');
    if (method === 'get' || method === 'GET') {
      return { data: list, status: 200, statusText: 'OK', headers: {}, config };
    }
    if (method === 'post' || method === 'POST') {
      const newFuel = { id: 'f_' + Date.now(), ...parsedData };
      list.push(newFuel);
      saveDb('fuel', list);
      return { data: newFuel, status: 201, statusText: 'Created', headers: {}, config };
    }
  }

  if (url.startsWith('/api/fuel/')) {
    const id = url.split('/').pop();
    let list = getDb('fuel');
    const index = list.findIndex(f => f.id === id);

    if (method === 'put' || method === 'PUT') {
      if (index !== -1) {
        list[index] = { ...list[index], ...parsedData };
        saveDb('fuel', list);
        return { data: list[index], status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Fuel entry not found' } } });
    }

    if (method === 'delete' || method === 'DELETE') {
      if (index !== -1) {
        const deleted = list[index];
        list = list.filter(f => f.id !== id);
        saveDb('fuel', list);
        return { data: deleted, status: 200, statusText: 'OK', headers: {}, config };
      }
      return Promise.reject({ response: { status: 404, data: { message: 'Fuel entry not found' } } });
    }
  }

  // DASHBOARD DATA ENDPOINT
  if (url === '/api/dashboard') {
    const vehicles = getDb('vehicles');
    const drivers = getDb('drivers');
    const trips = getDb('trips');
    const maintenance = getDb('maintenance');
    const fuel = getDb('fuel');

    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
    const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
    const vehiclesInShop = vehicles.filter(v => v.status === 'In Shop').length;
    const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
    const driversOnDuty = drivers.filter(d => d.status === 'On Trip' || d.status === 'Available').length;

    // Calculation
    const fleetUtilization = totalVehicles > 0 ? Math.round(((activeVehicles) / totalVehicles) * 100) : 0;

    // Dynamic stats and charts data
    return {
      data: {
        kpis: {
          activeVehicles,
          availableVehicles,
          vehiclesInShop,
          activeTrips,
          driversOnDuty,
          fleetUtilization
        },
        recentTrips: trips.slice(-5).reverse(),
        utilizationTrend: [
          { name: 'Mon', utilization: 65 },
          { name: 'Tue', utilization: 72 },
          { name: 'Wed', utilization: 80 },
          { name: 'Thu', utilization: 78 },
          { name: 'Fri', utilization: 85 },
          { name: 'Sat', utilization: 55 },
          { name: 'Sun', utilization: 40 }
        ],
        operationalCosts: [
          { name: 'Fuel', amount: fuel.reduce((acc, f) => acc + (f.expenseType === 'Fuel Fill' ? Number(f.amount) : 0), 0) },
          { name: 'Maintenance', amount: maintenance.reduce((acc, m) => acc + Number(m.cost), 0) },
          { name: 'Tolls & Fees', amount: fuel.reduce((acc, f) => acc + (f.expenseType !== 'Fuel Fill' ? Number(f.amount) : 0), 0) }
        ],
        fuelEfficiency: [
          { month: 'Jan', efficiency: 8.2 },
          { month: 'Feb', efficiency: 8.4 },
          { month: 'Mar', efficiency: 8.1 },
          { month: 'Apr', efficiency: 8.7 },
          { month: 'May', efficiency: 9.0 },
          { month: 'Jun', efficiency: 8.8 },
          { month: 'Jul', efficiency: 8.9 }
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // REPORTS DATA ENDPOINT
  if (url === '/api/reports') {
    const maintenance = getDb('maintenance');
    const fuel = getDb('fuel');
    const trips = getDb('trips');

    const totalFuelLitres = fuel.reduce((acc, f) => acc + Number(f.liters || 0), 0);
    const totalFuelCost = fuel.reduce((acc, f) => acc + (f.expenseType === 'Fuel Fill' ? Number(f.amount) : 0), 0);
    const totalMaintCost = maintenance.reduce((acc, m) => acc + Number(m.cost), 0);
    const totalOtherCost = fuel.reduce((acc, f) => acc + (f.expenseType !== 'Fuel Fill' ? Number(f.amount) : 0), 0);
    const totalOperationalCost = totalFuelCost + totalMaintCost + totalOtherCost;

    // ROI Calc mock
    const estimatedRevenue = trips.reduce((acc, t) => acc + (t.status === 'Completed' ? t.distance * 3.5 : 0), 0);
    const roi = estimatedRevenue > 0 ? Math.round(((estimatedRevenue - totalOperationalCost) / totalOperationalCost) * 100) : 18;

    return {
      data: {
        summary: {
          fuelEfficiency: '8.9 km/L',
          fleetUtilization: '74%',
          operationalCost: totalOperationalCost,
          roi: `${roi}%`
        },
        charts: {
          costDistribution: [
            { name: 'Fuel Costs', value: totalFuelCost },
            { name: 'Maintenance', value: totalMaintCost },
            { name: 'Tolls & Permits', value: totalOtherCost }
          ],
          efficiencyTrend: [
            { name: 'Volvo FH16', efficiency: 8.2 },
            { name: 'Tesla Semi', efficiency: 12.5 },
            { name: 'Kenworth T680', efficiency: 7.9 },
            { name: 'Isuzu NPR', efficiency: 10.1 }
          ],
          monthlyCosts: [
            { name: 'Jan', fuel: 2400, maint: 1100 },
            { name: 'Feb', fuel: 2800, maint: 850 },
            { name: 'Mar', fuel: 3100, maint: 1400 },
            { name: 'Apr', fuel: 2900, maint: 600 },
            { name: 'May', fuel: 3400, maint: 1900 },
            { name: 'Jun', fuel: 3200, maint: 1200 },
            { name: 'Jul', fuel: totalFuelCost, maint: totalMaintCost }
          ]
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config
    };
  }

  // Fallback 404
  return Promise.reject({
    response: {
      status: 404,
      data: { message: `Mock API endpoint not found: ${url}` }
    }
  });
};

export default api;
