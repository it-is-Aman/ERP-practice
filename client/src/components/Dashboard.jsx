import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, Calendar, DollarSign, Shield, BarChart, Package, FileText } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState({
    hr: { totalEmployees: 0, totalAttendance: 0, totalLeaves: 0 },
    finance: { totalRevenue: 0, totalExpenses: 0, netProfit: 0 },
    admin: { totalResources: 0, activeCompliances: 0, pendingNotifications: 0 },
    sales: { totalSales: 0, newCustomers: 0, activeDeals: 0 },
    product: { totalProducts: 0, lowStockItems: 0, newReleases: 0 }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const handleModuleClick = (path) => {
    navigate(path);
  };

  const modules = [
    { name: 'HR', icon: Users, stats: stats.hr, path: '/hr' },
    { name: 'Finance', icon: DollarSign, stats: stats.finance, path: '/finance' },
    { name: 'Admin/Legal', icon: Shield, stats: stats.admin, path: '/admin' },
    { name: 'Sales', icon: BarChart, stats: stats.sales, path: '/sales' },
    { name: 'Product', icon: Package, stats: stats.product, path: '/product' }
  ];

  return (
    <div className="space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-large">{module.name}</CardTitle>
              <module.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {Object.entries(module.stats).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              <Button className="mt-4 w-full" onClick={() => handleModuleClick(module.path)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;