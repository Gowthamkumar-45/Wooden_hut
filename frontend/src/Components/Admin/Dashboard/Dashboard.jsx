import React, { useState, useEffect } from 'react';

import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend 
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Filter,
  Package,
  ShoppingCart,
  Truck,
  Users,
  MessageSquare
} from 'lucide-react';
import { SITE_CONTENT } from '../../../constants/content';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    reviews: 0,
    contacts: 0,
    inStock: 0,
    delivered: 0,
    product_trend: 0,
    order_trend: 0,
    delivery_trend: 0,
    customer_trend: 0,
    review_trend: 0
  });
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Mock data for charts - in a real app, these would come from the backend
  const [analyticsData, setAnalyticsData] = useState([
    { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
  ]);

  const [trafficData, setTrafficData] = useState([
    { name: 'WhatsApp', value: 0, color: '#22c55e' },
    { name: 'Web Inquiries', value: 0, color: '#7c3aed' },
    { name: 'Feedback', value: 0, color: '#f59e0b' },
  ]);

  const [productSalesData, setProductSalesData] = useState([
    { name: 'Not Started', value: 0, trend: '+0%' },
    { name: 'In Production', value: 0, trend: '+0%' },
    { name: 'Delivered', value: 0, trend: '+0%' },
    { name: 'Cancelled', value: 0, trend: '+0%', isNegative: true },
  ]);

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
    const imgPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${imgPath}`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Token ${token}` } : {};
        
        const notifyRes = await fetch(`${SITE_CONTENT.api.base}/api/notifications/?filter=${timeFilter}`, { headers });
        const productsRes = await fetch(`${SITE_CONTENT.api.base}/api/products/`, { headers });
        
        if (notifyRes.status === 401 || productsRes.status === 401) {
          // Stale token from different environment (e.g. Render vs Local)
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/login';
          return;
        }
        
        if (notifyRes.ok && productsRes.ok) {
          const notifyData = await notifyRes.json();
          const productsData = await productsRes.json();
          
          // Handle paginated or non-paginated product data
          const productItems = Array.isArray(productsData) ? productsData : (productsData.results || []);
          const totalProductsCount = Array.isArray(productsData) ? productsData.length : (productsData.count || 0);
          
          setProducts(productItems.slice(0, 5));
          
          // Use real stats from the enhanced NotificationAPIView
          const backendStats = notifyData.stats || {};
          setAnalyticsData(backendStats.monthly_orders || []);
          if (backendStats.traffic_stats) {
            setTrafficData(backendStats.traffic_stats);
          }
          if (backendStats.sales_pipeline) {
             setProductSalesData([
               { name: 'Not Started', value: backendStats.sales_pipeline.packed || 0, trend: '+0%' },
               { name: 'In Production', value: backendStats.sales_pipeline.shipped || 0, trend: '+0%' },
               { name: 'Delivered', value: backendStats.sales_pipeline.delivered || 0, trend: '+0%' },
               { name: 'Cancelled', value: backendStats.sales_pipeline.cancelled || 0, trend: '+0%', isNegative: true },
             ]);
          }
          
          setStats({
            products: backendStats.total_products || totalProductsCount,
            orders: backendStats.total_confirmed || 0,
            delivered: backendStats.total_delivered || 0,
            reviews: backendStats.total_reviews || 0,
            contacts: notifyData.total_notifications || 0,
            inStock: backendStats.in_stock || 0,
            product_trend: backendStats.product_trend || 0,
            order_trend: backendStats.order_trend || 0,
            delivery_trend: backendStats.delivery_trend || 0,
            customer_trend: backendStats.customer_trend || 0,
            review_trend: backendStats.review_trend || 0
          });
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeFilter]);

  const handleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setProducts([...products].sort((a, b) => {
      return newOrder === 'desc' 
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at);
    }));
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Category,Stock Status,Added On\n"
      + products.map(p => `${p.name},${p.category_name},${p.in_stock ? 'In Stock' : 'Out of Stock'},${new Date(p.created_at).toLocaleDateString()}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "top_selling_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statCards = [
    { 
      title: 'Total Products', 
      value: stats.products, 
      trend: `${stats.product_trend > 0 ? '+' : ''}${stats.product_trend}%`, 
      isUp: stats.product_trend >= 0, 
      icon: <Package size={20} />,
      color: '#7c3aed'
    },
    { 
      title: 'Confirmed Orders', 
      value: stats.orders, 
      trend: `${stats.order_trend > 0 ? '+' : ''}${stats.order_trend}%`, 
      isUp: stats.order_trend >= 0, 
      icon: <ShoppingCart size={20} />,
      color: '#10b981'
    },
    { 
      title: 'Orders Delivered', 
      value: stats.delivered, 
      trend: `${stats.delivery_trend > 0 ? '+' : ''}${stats.delivery_trend}%`, 
      isUp: stats.delivery_trend >= 0, 
      icon: <Truck size={20} />,
      color: '#f59e0b'
    },
    { 
      title: 'Total Customers', 
      value: stats.contacts, 
      trend: `${stats.customer_trend > 0 ? '+' : ''}${stats.customer_trend}%`, 
      isUp: stats.customer_trend >= 0, 
      icon: <Users size={20} />,
      color: '#3b82f6'
    },
    { 
      title: 'Client Reviews', 
      value: stats.reviews, 
      trend: `${stats.review_trend > 0 ? '+' : ''}${stats.review_trend}%`, 
      isUp: stats.review_trend >= 0, 
      icon: <MessageSquare size={20} />,
      color: '#8b5e3c'
    }
  ];

  if (loading) return (
    <div className="dashboard-loading">
      <div className="loader-content">
        <div className="pulse-loader"></div>
        <span>Preparing your dashboard...</span>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Overview Section */}
      <div className="overview-header">

        <div className="header-actions">
          <select 
            className="date-filter-select" 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ padding: '8px 24px 8px 12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px top 50%', backgroundSize: '10px auto' }}
          >
            <option value="all">All Time</option>
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="today">Today Date wise</option>
          </select>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <div className="card-top">
              <div 
                className="card-icon-wrapper" 
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
              >
                {card.icon}
              </div>
              <div className={`trend-badge ${card.isUp ? 'up' : 'down'}`}>
                {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {card.trend}
              </div>
            </div>
            <div className="card-content">
              <span className="card-title">{card.title}</span>
              <div className="card-value">{card.value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="charts-row">
        <div className="chart-card analytics-card">
          <div className="chart-header">
            <h3>Order Analytics</h3>
            <span className="date-badge">Data as of {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorConfirmed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="Confirmed" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorConfirmed)" animationDuration={1500} />
                <Area type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPending)" animationDuration={1800} />
                <Area type="monotone" dataKey="Cancelled" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCancelled)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card traffic-card">
          <div className="chart-header">
            <h3>Enquirys</h3>
          </div>
          <div className="time-toggle">
            <button 
              className={timeFilter === 'weekly' ? 'active' : ''}
              onClick={() => setTimeFilter('weekly')}
            >Week</button>
            <button 
              className={timeFilter === 'monthly' ? 'active' : ''}
              onClick={() => setTimeFilter('monthly')}
            >Month</button>
          </div>
          <div className="traffic-bar-container">
            {trafficData.map((item, i) => (
              <div className="traffic-bar-row" key={i}>
                <div className="bar-bg">
                  <div className="bar-fill" style={{ width: `${item.value}%`, background: item.color }}>
                    <span className="bar-percent">{item.value}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="traffic-legend">
            {trafficData.map((item, i) => (
              <div className="legend-item" key={i}>
                <span className="dot" style={{ background: item.color }}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        <div className="table-card">
          <div className="table-header">
            <h3>Top Selling</h3>
            <div className="table-actions">
              <button className="filter-btn" onClick={handleSort}>
                <Filter size={14}/> Sort by: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
              </button>
              <button className="filter-btn" onClick={handleExportCSV}>
                <Download size={14}/> Export CSV
              </button>
            </div>
          </div>
          <table className="products-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Product info</th>
                <th>Category</th>
                <th>Status</th>
                <th>Stock Since</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td><span style={{ fontWeight: '700', color: '#cbd5e1', fontSize: '12px' }}>#{String(i + 1).padStart(2, '0')}</span></td>
                  <td className="product-info">
                    <img 
                      src={getImageUrl(p.main_image)} 
                      alt="" 
                      onError={(e) => {
                        if (e.target.src !== 'https://via.placeholder.com/50x50?text=No+Image') {
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }
                      }}
                    />
                    <span>{p.name}</span>
                  </td>
                  <td style={{ fontWeight: '500', color: '#64748b' }}>{p.category_name}</td>
                  <td>
                    <span className={`status-tag ${p.in_stock ? 'in' : 'out'}`}>
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="stock-date">{new Date(p.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="product-sales-card">
          <div className="chart-header">
            <h3>Product Status</h3>
            <select 
              className="date-select"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              style={{
                padding: '6px 28px 6px 12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                cursor: 'pointer',
                backgroundColor: '#fff',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                appearance: 'none', 
                WebkitAppearance: 'none', 
                MozAppearance: 'none', 
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', 
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'right 10px top 50%', 
                backgroundSize: '10px auto'
              }}
            >
              <option value="all">All Time</option>
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="today">Today Date wise</option>
            </select>
          </div>
          <div className="sales-stats">
            {productSalesData.map((d, i) => (
              <div className="sales-stat-item" key={i}>
                <div className="stat-value-group">
                  <span className="stat-value">{d.value}</span>
                  <span className={`stat-trend ${d.isNegative ? 'negative' : ''}`}>{d.trend}</span>
                </div>
                <div className={`stat-bar-vertical ${d.isNegative ? 'negative' : ''}`}>
                  <div className="bar-fill" style={{ height: `${Math.min((d.value / Math.max(...productSalesData.map(s => s.value), 1)) * 100, 100)}%` }}></div>
                </div>
                <span className="stat-label">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
