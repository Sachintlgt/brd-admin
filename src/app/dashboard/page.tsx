import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { AlertTriangle, Construction, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center w-full h-full p-6">
        <Card className="w-full max-w-lg border border-gray-200 shadow-lg rounded-2xl bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-3">
              <Construction className="w-12 h-12 animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-semibold">Page Under Development</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-center text-gray-600">
            <p className="text-base">
              We're actively working on this dashboard to bring you a better experience.
            </p>

            <div className="flex items-center justify-center gap-2 font-medium text-amber-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Work in progress</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Clock className="w-5 h-5" />
              <span>Expected updates coming soon</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
