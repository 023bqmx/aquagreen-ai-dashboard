import Breadcrumb from "@/components/Breadcrumb";
import LiveClock from "@/components/LiveClock";
import SystemStatusChart from "@/components/SystemStatusChart";
import SensorReadings from "@/components/SensorReadings";
import TrendChart from "@/components/TrendChart";
import DailyReportChart from "@/components/DailyReportChart";
import AlertSystem from "@/components/AlertSystem";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <Breadcrumb />
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
          <LiveClock />
        </div>

        {/* Alert System */}
        <div className="mb-8">
          <AlertSystem />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - System Status */}
          <div className="lg:col-span-1">
            <SystemStatusChart />
          </div>
          
          {/* Right Column - Sensor Readings */}
          <div className="lg:col-span-2">
            <SensorReadings />
          </div>
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TrendChart />
          <DailyReportChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
