// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.Vite_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
mongoose.connect(process.env.Vite_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes for HR Module
app.use('/api/employees', require('./routes/hr/employeeRoutes'));
app.use('/api/attendance', require('./routes/hr/attendanceRoutes'));
app.use('/api/leaves', require('./routes/hr/leaveRoutes'));
app.use('/api/payroll', require('./routes/hr/payrollRoutes'));

// Routes for Admin/Legal Module
app.use('/api/resources', require('./routes/admin/resourceRoutes'));
app.use('/api/compliance', require('./routes/admin/complianceRoutes'));
app.use('/api/documents', require('./routes/admin/documentRoutes'));
app.use('/api/notifications', require('./routes/admin/notificationRoutes'));

// New route for dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const stats = {
      hr: {
        totalEmployees: await mongoose.model('Employee').countDocuments(),
        totalAttendance: await mongoose.model('Attendance').countDocuments(),
        totalLeaves: await mongoose.model('Leave').countDocuments(),
      },
      finance: {
        totalRevenue: 1000000, // Placeholder value
        totalExpenses: 750000, // Placeholder value
        netProfit: 250000, // Placeholder value
      },
      admin: {
        totalResources: await mongoose.model('Resource').countDocuments(),
        activeCompliances: await mongoose.model('Compliance').countDocuments({ status: 'Active' }),
        pendingNotifications: await mongoose.model('Notification').countDocuments({ status: 'Pending' }),
      },
      sales: {
        totalSales: 500, // Placeholder value
        newCustomers: 50, // Placeholder value
        activeDeals: 25, // Placeholder value
      },
      product: {
        totalProducts: 100, // Placeholder value
        lowStockItems: 15, // Placeholder value
        newReleases: 5, // Placeholder value
      },
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));