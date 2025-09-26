import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  PieChart,
  Users,
  FileText,
  Shield,
  Zap,
  Globe,
  Database
} from 'lucide-react';

interface BlockchainMetrics {
  totalTransactions: number;
  blockHeight: number;
  networkNodes: number;
  consensusTime: number;
  throughput: number;
  pendingTransactions: number;
  successRate: number;
  networkHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

interface TimeSeriesData {
  timestamp: string;
  pending: number;
  approved: number;
  rejected: number;
  transactions: number;
  blockTime: number;
}

interface ApiSummaryData {
  summary: Record<string, {
    Pending: number;
    Approved: number;
    Rejected: number;
  }>;
  totals: {
    Pending: number;
    Approved: number;
    Rejected: number;
  };
}

interface BlockchainAnalyticsProps {
  organizationType: string;
  userRole: string;
}

export const BlockchainAnalytics: React.FC<BlockchainAnalyticsProps> = ({
  organizationType,
  userRole
}) => {
  const [metrics, setMetrics] = useState<BlockchainMetrics>({
    totalTransactions: 0,
    blockHeight: 0,
    networkNodes: 4,
    consensusTime: 0,
    throughput: 0,
    pendingTransactions: 0,
    successRate: 0,
    networkHealth: 'Good'
  });

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  // Fetch real API data and generate analytics
  const fetchAnalyticsData = async () => {
    try {
      // Fetch real approval data from API
      const response = await fetch('http://localhost:8000/api/approval-channels/summary', {
        headers: {
          'X-User-Role': userRole,
          'Content-Type': 'application/json'
        }
      });

      let apiData: ApiSummaryData | null = null;
      if (response.ok) {
        apiData = await response.json();
      }

      // Generate time series data with real API data as base
      const now = new Date();
      const data: TimeSeriesData[] = [];
      
      // Get current real metrics
      const isSupervisor = userRole === 'Bank Supervisor' || userRole === 'Bank Officer';
      let currentPending = 0;
      let currentApproved = 0;
      let currentRejected = 0;

      if (apiData) {
        if (isSupervisor) {
          // Use totals for supervisors
          currentPending = apiData.totals?.Pending || 0;
          currentApproved = apiData.totals?.Approved || 0;
          currentRejected = apiData.totals?.Rejected || 0;
        } else {
          // Map frontend org names to API org names
          const orgMapping: Record<string, string> = {
            'coffee-authority': 'quality-authority',
            'national-bank': 'national-bank',
            'exporter-bank': 'exporter-bank',
            'customs': 'customs'
          };
          const apiOrgName = orgMapping[organizationType] || organizationType;
          const orgData = apiData.summary?.[apiOrgName];
          
          if (orgData) {
            currentPending = orgData.Pending || 0;
            currentApproved = orgData.Approved || 0;
            currentRejected = orgData.Rejected || 0;
          }
        }
      }

      // Generate simple historical trend data based on current real data (no mock transactions)
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
        const variance = 0.2; // 20% variance for historical simulation
        
        data.push({
          timestamp,
          pending: Math.max(0, Math.floor(currentPending * (1 + (Math.random() - 0.5) * variance))),
          approved: Math.max(0, Math.floor(currentApproved * (1 + (Math.random() - 0.5) * variance))),
          rejected: Math.max(0, Math.floor(currentRejected * (1 + (Math.random() - 0.5) * variance))),
          transactions: 0, // Remove mock transaction data
          blockTime: 0 // Remove mock block time data
        });
      }
      
      // Set current real data as the latest point
      if (data.length > 0) {
        data[data.length - 1].pending = currentPending;
        data[data.length - 1].approved = currentApproved;
        data[data.length - 1].rejected = currentRejected;
      }
      
      setTimeSeriesData(data);
      
      // Calculate real metrics from approval data only
      const totalApproved = currentApproved;
      const totalRejected = currentRejected;
      const totalProcessed = totalApproved + totalRejected;
      const successRate = totalProcessed > 0 ? (totalApproved / totalProcessed) * 100 : 0;
      
      setMetrics({
        totalTransactions: totalProcessed, // Use real processed documents count
        blockHeight: 0, // Remove mock blockchain data
        networkNodes: 4, // Keep static network info
        consensusTime: 0, // Remove mock consensus time
        throughput: 0, // Remove mock throughput
        pendingTransactions: currentPending,
        successRate: Math.round(successRate),
        networkHealth: successRate > 90 ? 'Excellent' : successRate > 80 ? 'Good' : successRate > 70 ? 'Fair' : 'Poor'
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Fallback to mock data if API fails
      generateMockData();
    }
  };

  // Generate mock blockchain data for demonstration (fallback)
  const generateMockData = () => {
    const now = new Date();
    const data: TimeSeriesData[] = [];
    
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000).toISOString();
      data.push({
        timestamp,
        pending: Math.floor(Math.random() * 20) + 5,
        approved: Math.floor(Math.random() * 50) + 20,
        rejected: Math.floor(Math.random() * 10) + 2,
        transactions: Math.floor(Math.random() * 100) + 50,
        blockTime: Math.random() * 2 + 3 // 3-5 seconds
      });
    }
    
    setTimeSeriesData(data);
    
    // Calculate metrics from data
    const totalTx = data.reduce((sum, d) => sum + d.transactions, 0);
    const avgBlockTime = data.reduce((sum, d) => sum + d.blockTime, 0) / data.length;
    const totalApproved = data.reduce((sum, d) => sum + d.approved, 0);
    const totalRejected = data.reduce((sum, d) => sum + d.rejected, 0);
    const successRate = (totalApproved / (totalApproved + totalRejected)) * 100;
    
    setMetrics({
      totalTransactions: totalTx,
      blockHeight: 15420 + Math.floor(Math.random() * 100),
      networkNodes: 4,
      consensusTime: avgBlockTime,
      throughput: Math.floor(totalTx / 24),
      pendingTransactions: data[data.length - 1]?.pending || 0,
      successRate: Math.round(successRate),
      networkHealth: successRate > 90 ? 'Excellent' : successRate > 80 ? 'Good' : successRate > 70 ? 'Fair' : 'Poor'
    });
  };

  useEffect(() => {
    setLoading(true);
    // Fetch real analytics data
    fetchAnalyticsData().finally(() => setLoading(false));

    // Update data every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeRange, organizationType, userRole]);

  // Simple line chart component
  const LineChart: React.FC<{ data: TimeSeriesData[]; dataKey: keyof TimeSeriesData; color: string; title: string }> = ({ 
    data, dataKey, color, title 
  }) => {
    const maxValue = Math.max(...data.map(d => Number(d[dataKey])));
    const minValue = Math.min(...data.map(d => Number(d[dataKey])));
    const range = maxValue - minValue || 1;

    return (
      <div className="w-full h-32 relative">
        <svg width="100%" height="100%" className="overflow-visible">
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#e5e7eb"
              strokeWidth="1"
              opacity="0.5"
            />
          ))}
          
          {/* Data line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - ((Number(d[dataKey]) - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Fill area */}
          <polygon
            fill={`url(#gradient-${dataKey})`}
            points={`0,100 ${data.map((d, i) => {
              const x = (i / (data.length - 1)) * 100;
              const y = 100 - ((Number(d[dataKey]) - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(' ')} 100,100`}
          />
          
          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - ((Number(d[dataKey]) - minValue) / range) * 100;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={color}
                className="hover:r-4 transition-all cursor-pointer"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Excellent': return 'text-gold-600 bg-gold-100';
      case 'Good': return 'text-purple-600 bg-purple-100';
      case 'Fair': return 'text-gold-700 bg-gold-200';
      case 'Poor': return 'text-purple-700 bg-purple-200';
      default: return 'text-dark-600 bg-dark-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-dark-600">Loading blockchain analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Blockchain Analytics
          </h1>
          <p className="text-dark-600 mt-2">
            {(() => {
              const isSupervisor = userRole === 'Bank Supervisor' || userRole === 'Bank Officer';
              if (isSupervisor) {
                return 'Global network insights • All organizations • Real-time blockchain metrics';
              } else {
                const orgNames = {
                  'national-bank': 'National Bank',
                  'exporter-bank': 'Exporter Bank', 
                  'coffee-authority': 'Coffee Quality Authority',
                  'customs': 'Customs Authority'
                };
                const orgName = orgNames[organizationType as keyof typeof orgNames] || organizationType;
                return `${orgName} analytics • Organization-specific insights • Real-time blockchain metrics`;
              }
            })()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {['1h', '24h', '7d', '30d'].map(range => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeRange(range)}
              className={selectedTimeRange === range ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Status Overview - Matching Dashboard Format */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <Card className="border-l-4 border-l-gold-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-600">PENDING</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-gold-600 to-gold-700 bg-clip-text text-transparent">
                  {timeSeriesData[timeSeriesData.length - 1]?.pending || 0}
                </p>
              </div>
              <Clock className="w-6 h-6 text-gold-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-600">APPROVED</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {timeSeriesData[timeSeriesData.length - 1]?.approved || 0}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-600">REJECTED</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
                  {timeSeriesData[timeSeriesData.length - 1]?.rejected || 0}
                </p>
              </div>
              <XCircle className="w-6 h-6 text-purple-700" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Overview - Real Data Only */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-gold-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">System Health</p>
                <Badge className={`mt-1 ${getHealthColor(metrics.networkHealth)}`}>
                  {metrics.networkHealth}
                </Badge>
              </div>
              <Shield className="w-8 h-8 text-gold-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">Active Organizations</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.networkNodes}</p>
              </div>
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-dark-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">Total Processed</p>
                <p className="text-2xl font-bold text-dark-600">{metrics.totalTransactions}</p>
              </div>
              <FileText className="w-8 h-8 text-dark-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Document Processing Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600">APPROVED Documents</span>
                  <span className="text-sm text-purple-600 font-semibold">
                    {timeSeriesData[timeSeriesData.length - 1]?.approved || 0}
                  </span>
                </div>
                <LineChart 
                  data={timeSeriesData} 
                  dataKey="approved" 
                  color="#7c3aed" 
                  title="APPROVED"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600">PENDING Documents</span>
                  <span className="text-sm text-gold-600 font-semibold">
                    {timeSeriesData[timeSeriesData.length - 1]?.pending || 0}
                  </span>
                </div>
                <LineChart 
                  data={timeSeriesData} 
                  dataKey="pending" 
                  color="#f59e0b" 
                  title="PENDING"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-600">REJECTED Documents</span>
                  <span className="text-sm text-purple-700 font-semibold">
                    {timeSeriesData[timeSeriesData.length - 1]?.rejected || 0}
                  </span>
                </div>
                <LineChart 
                  data={timeSeriesData} 
                  dataKey="rejected" 
                  color="#dc2626" 
                  title="REJECTED"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-dark-600" />
              Network Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-600">Total Documents</span>
              <span className="font-semibold">{metrics.totalTransactions.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-600">Approval Rate</span>
              <span className="font-semibold text-gold-600">{metrics.successRate}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-600">Pending Approvals</span>
              <span className="font-semibold text-gold-600">{metrics.pendingTransactions}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-600">System Status</span>
              <span className="font-semibold text-gold-600">OPERATIONAL</span>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-dark-700 mb-2">Organizations Status</h4>
              <div className="space-y-2">
                {[
                  { name: 'National Bank', color: 'bg-purple-500', role: 'License Validator' },
                  { name: 'Exporter Bank', color: 'bg-gold-500', role: 'Invoice Validator' },
                  { name: 'Coffee Authority', color: 'bg-gold-600', role: 'Quality Validator' },
                  { name: 'Customs', color: 'bg-dark-600', role: 'Shipping Validator' }
                ].map((org, i) => (
                  <div key={org.name} className="flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="text-dark-700 font-medium">{org.name}</span>
                      <span className="text-dark-500 text-xs">{org.role}</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${org.color}`}></div>
                      <span className="text-gold-600 font-medium">ACTIVE</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Processing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-gold-600" />
            Document Processing Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-gradient-to-r from-gold-50 to-gold-100 rounded-lg">
              <p className="text-3xl font-bold text-gold-600">{timeSeriesData[timeSeriesData.length - 1]?.approved || 0}</p>
              <p className="text-sm text-dark-600 font-medium">APPROVED Documents</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-gold-100 to-gold-200 rounded-lg">
              <p className="text-3xl font-bold text-gold-600">{timeSeriesData[timeSeriesData.length - 1]?.pending || 0}</p>
              <p className="text-sm text-dark-600 font-medium">PENDING Documents</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <p className="text-3xl font-bold text-purple-700">{timeSeriesData[timeSeriesData.length - 1]?.rejected || 0}</p>
              <p className="text-sm text-dark-600 font-medium">REJECTED Documents</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainAnalytics;
