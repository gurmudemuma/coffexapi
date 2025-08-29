import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Payment,
  CheckCircle,
  Warning,
  Schedule,
  Visibility,
  Download,
  Refresh,
  CreditCard,
  MonetizationOn,
  Receipt,
  SwapHoriz,
  Security,
  ExpandMore,
  Analytics,
  CurrencyExchange,
  Wallet,
  Business,
  Assignment,
  VerifiedUser,
  LocalOffer,
  Speed,
} from '@mui/icons-material';
import {
  StandardButton as Button,
  StandardCard as Card,
  StandardCardContent as CardContent,
  StandardBadge as Badge,
  Alert,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../components/ui';
import { useAuth } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import ApproversPanel from '../components/ApproversPanel';
// Add the organization branding import
import { ORGANIZATION_BRANDING } from '../config/organizationBranding';

interface BankDashboardStats {
  totalTransactions: number;
  pendingPayments: number;
  totalVolume: number;
  exchangeRate: number;
  avgProcessingTime: number;
  paymentMethods: any[];
  recentTransactions: any[];
  monthlyVolume: any[];
  currencyDistribution: any[];
}

const BankDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<BankDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Get organization branding
  const orgBranding = ORGANIZATION_BRANDING['exporter-bank'];

  useEffect(() => {
    fetchBankData();
  }, []);

  const fetchBankData = async () => {
    setLoading(true);
    try {
      // Fetch Bank-specific data with organization filtering
      const response = await fetch(`http://localhost:8000/api/bank-dashboard-stats?org=exporter-bank`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Organization': 'exporter-bank',
          'X-User-Role': user?.role || '',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && (data.data.organization === 'Exporter Bank' || data.data.organization === 'Commercial Bank of Ethiopia')) {
          setStats(data.data.stats);
        } else {
          throw new Error('Invalid organization data received');
        }
      } else {
        throw new Error('Failed to fetch Bank data');
      }
    } catch (error) {
      console.error('Error fetching Bank dashboard data:', error);
      // Fallback to Bank-specific mock data (only for Bank users)
      if (user?.organization === 'Exporter Bank' || user?.organization === 'Commercial Bank of Ethiopia') {
        const bankSpecificStats: BankDashboardStats = {
          totalTransactions: 2847,
          pendingPayments: 23,
          totalVolume: 12500000.00,
          exchangeRate: 115.25,
          avgProcessingTime: 2.4,
          paymentMethods: [
            { name: 'Wire Transfer', count: 1524, amount: 8750000, percentage: 70, color: orgBranding.chartColors[0] },
            { name: 'L/C Payments', count: 834, amount: 2890000, percentage: 23, color: orgBranding.chartColors[1] },
            { name: 'Digital Payments', count: 489, amount: 860000, percentage: 7, color: orgBranding.chartColors[2] },
          ],
          recentTransactions: [
            {
              id: 'TXN-2024-7854',
              exporter: 'Highland Coffee Exports Ltd.',
              buyer: 'European Coffee Importers GmbH',
              amount: 285000.00,
              currency: 'USD',
              birr_amount: 32818750.00,
              method: 'Wire Transfer',
              status: 'Completed',
              fees: 1425.00,
              timestamp: '45 minutes ago',
              reference: 'HC-EUR-2024-089'
            },
            {
              id: 'TXN-2024-7855',
              exporter: 'Sidama Coffee Corporation',
              buyer: 'American Coffee Roasters Inc.',
              amount: 456000.00,
              currency: 'USD',
              birr_amount: 52554000.00,
              method: 'L/C Payment',
              status: 'Processing',
              fees: 2280.00,
              timestamp: '1 hour ago',
              reference: 'SC-USA-2024-156'
            },
            {
              id: 'TXN-2024-7856',
              exporter: 'Yirgacheffe Premium Exports',
              buyer: 'Japanese Coffee Trading Co.',
              amount: 189000.00,
              currency: 'USD',
              birr_amount: 21772250.00,
              method: 'Digital Payment',
              status: 'Pending Approval',
              fees: 945.00,
              timestamp: '2 hours ago',
              reference: 'YP-JPN-2024-203'
            },
            {
              id: 'TXN-2024-7857',
              exporter: 'Kaffa Coffee Export LLC',
              buyer: 'Middle East Coffee Distributors',
              amount: 198000.00,
              currency: 'USD',
              birr_amount: 22819500.00,
              method: 'Wire Transfer',
              status: 'Failed',
              fees: 0.00,
              timestamp: '3 hours ago',
              reference: 'KC-UAE-2024-078'
            },
          ],
          monthlyVolume: [
            { month: 'Jan', volume: 8900000, transactions: 2156, avg_amount: 4130 },
            { month: 'Feb', volume: 9200000, transactions: 2284, avg_amount: 4028 },
            { month: 'Mar', volume: 10100000, transactions: 2398, avg_amount: 4213 },
            { month: 'Apr', volume: 11800000, transactions: 2567, avg_amount: 4598 },
            { month: 'May', volume: 12200000, transactions: 2689, avg_amount: 4538 },
            { month: 'Jun', volume: 12500000, transactions: 2847, avg_amount: 4390 },
          ],
          currencyDistribution: [
            { name: 'USD', value: 87.5, amount: 10937500, color: orgBranding.chartColors[0] },
            { name: 'EUR', value: 8.2, amount: 1025000, color: orgBranding.chartColors[1] },
            { name: 'GBP', value: 2.8, amount: 350000, color: orgBranding.chartColors[2] },
            { name: 'Other', value: 1.5, amount: 187500, color: orgBranding.chartColors[3] },
          ]
        };
        setStats(bankSpecificStats);
      } else {
        // If user is not from Bank, show empty stats as security measure
        setStats({
          totalTransactions: 0,
          pendingPayments: 0,
          totalVolume: 0,
          exchangeRate: 0,
          avgProcessingTime: 0,
          paymentMethods: [],
          recentTransactions: [],
          monthlyVolume: [],
          currencyDistribution: [],
        });
      }
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Processing': return 'warning';
      case 'Pending Approval': return 'info';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    if (currency === 'ETB') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2,
      }).format(amount).replace('ETB', 'ETB');
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading || !stats) {
    return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Loading Bank Dashboard...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: orgBranding.backgroundColor, minHeight: '100vh', p: 3 }}>
      {/* Bank Header with enhanced branding */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: orgBranding.primaryColor, width: 56, height: 56, mr: 2 }}>
            <AccountBalance sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: orgBranding.primaryColor, mb: 0 }}>
              Exporter Bank
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Exporter Bank International Payment Services - Welcome, {user?.name}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="primary"
            icon={<CurrencyExchange />}
            className={`bg-[${orgBranding.primaryColor}] hover:bg-[${orgBranding.secondaryColor}]`}
          >
            Exchange Rates
          </Button>
          <Button
            variant="outline"
            icon={<Refresh />}
            onClick={fetchBankData}
            className={`border-[${orgBranding.primaryColor}] text-[${orgBranding.primaryColor}] hover:bg-[${orgBranding.primaryColor}] hover:text-white`}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Key Performance Indicators with enhanced branding */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${orgBranding.primaryColor}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Transactions
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.primaryColor }}>
                    {stats.totalTransactions.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUp color="success" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="success.main">
                      +12.5% this month
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: orgBranding.primaryColor }}>
                  <MonetizationOn />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${orgBranding.primaryColor}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Pending Payments
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.primaryColor }}>
                    {stats.pendingPayments}
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                    Awaiting Processing
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: orgBranding.primaryColor }}>
                  <Schedule />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className={`border-2 border-[${orgBranding.accentColor}] rounded-lg shadow-lg`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Monthly Volume
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: orgBranding.accentColor }}>
                    {formatCurrency(stats.totalVolume)}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    +18.7% growth
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: orgBranding.accentColor }}>
                  <CreditCard />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outline" className="border-2 border-red-500 rounded-lg shadow-lg">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Avg. Processing Time
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                    {stats.avgProcessingTime} min
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Target: {'<'}5 min
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#d32f2f' }}>
                  <SwapHoriz />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for Bank Dashboard */}
      <Card variant="outline" className="mb-4">
        <Tabs value={activeTab.toString()} onValueChange={(value) => setActiveTab(parseInt(value))}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="0" className="flex items-center gap-2">
              <Assignment className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="1" className="flex items-center gap-2">
              <VerifiedUser className="h-4 w-4" />
              Invoice Validation
            </TabsTrigger>
            <TabsTrigger value="2" className="flex items-center gap-2">
              <LocalOffer className="h-4 w-4" />
              Payment Processing
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Charts and Analytics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                    Monthly Transaction Volume
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.monthlyVolume}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <RechartsTooltip 
                        formatter={(value: any) => [formatCurrency(value), 'Volume']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Area type="monotone" dataKey="volume" stroke="#f57c00" fill="url(#colorVolume)" />
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f57c00" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f57c00" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                    Payment Methods
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="percentage"
                      >
                        {stats.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: any) => [`${value}%`, 'Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: 2 }}>
                    {stats.paymentMethods.map((method, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: 12, height: 12, bgcolor: method.color, borderRadius: '50%', mr: 1 }} />
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {method.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {method.percentage}%
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Recent Transactions */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                  Recent Transactions
                </Typography>
                <Button
                  variant="outline"
                  icon={<Download />}
                  className="border-[#f57c00] text-[#f57c00]"
                >
                  Export Report
                </Button>
              </Box>
              
              <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fff3e0' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Exporter</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Buyer</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Amount (USD)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Birr Equivalent</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Fees</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentTransactions.map((transaction, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {transaction.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{transaction.exporter}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{transaction.buyer}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatCurrency(transaction.birr_amount, 'ETB')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="warning"
                            size="sm"
                          >
                            {transaction.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(transaction.status) as any}
                            size="sm"
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatCurrency(transaction.fees)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.timestamp}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="primary" size="sm">
                            Process Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="outline">
                  View All Transactions
                </Button>
                <Button variant="primary">
                  Process Payments
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Additional Banking Services */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                    Currency Distribution
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {stats.currencyDistribution.map((currency, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {currency.name}
                          </Typography>
                          <Typography variant="body2">
                            {currency.value}% ({formatCurrency(currency.amount)})
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={currency.value}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#fff3e0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: currency.color,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Button
                        icon={<Payment />}
                        className="w-full border-[#f57c00] text-[#f57c00] py-1.5"
                      >
                        Process Payment
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        icon={<CurrencyExchange />}
                        className="w-full border-[#f57c00] text-[#f57c00] py-1.5"
                      >
                        Exchange Rate
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        icon={<Receipt />}
                        className="w-full border-[#f57c00] text-[#f57c00] py-1.5"
                      >
                        Generate Report
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        icon={<Security />}
                        className="w-full border-[#f57c00] text-[#f57c00] py-1.5"
                      >
                        Compliance Check
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {activeTab === 1 && (
        /* Invoice Validation */
        <Box>
          <ApproversPanel organizationType="exporter-bank" />
        </Box>
      )}

      {activeTab === 2 && (
        /* Payment Processing */
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                  Payment Processing Center
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Manage payment workflows, currency exchanges, and transaction processing.
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3, border: '2px solid #f57c00', borderRadius: 2 }}>
                      <Payment sx={{ fontSize: 48, color: '#f57c00', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                        Wire Transfers
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Process international wire transfers with real-time tracking
                      </Typography>
                      <Button variant="primary" className="bg-[#f57c00]">
                        Process Transfer
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3, border: '2px solid #ff9800', borderRadius: 2 }}>
                      <CreditCard sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                        L/C Payments
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Manage Letter of Credit payments and documentary collections
                      </Typography>
                      <Button variant="primary" className="bg-[#ff9800]">
                        Manage L/C
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 3, border: '2px solid #ffb74d', borderRadius: 2 }}>
                      <CurrencyExchange sx={{ fontSize: 48, color: '#ffb74d', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#ffb74d', fontWeight: 'bold' }}>
                        Currency Exchange
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Real-time currency conversion and rate management
                      </Typography>
                      <Button variant="primary" className="bg-[#ffb74d]">
                        View Rates
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                    Payment Statistics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h5" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                          {stats.pendingPayments}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Payments
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                          {stats.avgProcessingTime}h
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Avg Processing Time
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                          {formatCurrency(stats.totalVolume)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Monthly Volume
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h5" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                          {stats.exchangeRate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          USD/ETB Rate
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default BankDashboard;