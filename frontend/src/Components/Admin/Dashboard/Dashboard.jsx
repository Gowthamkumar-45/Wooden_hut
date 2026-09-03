import React, { useState, useEffect } from 'react';

import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend,
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Package,
  PackageCheck,
  ShoppingCart,
  Truck,
  Users,
  MessageSquare,
  Smartphone,
  CircleX,
  PackageX,
  TrendingUp,
  Factory,
  ClipboardList,
  Inbox,
  Clock,
  PackagePlus,
  Eye
} from 'lucide-react';
import { SITE_CONTENT } from '../../../constants/content';
import './Dashboard.css';

// Counts a card's number up from 0 to its real value once that row's data
// is ready — reset back to 0 while `loading` is true, so switching a row's
// filter visibly drops the figure and counts it back up rather than
// jumping straight to the new number.
function useCountUp(target, loading, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (loading) { setCount(0); return; }
    if (typeof target !== 'number' || target === 0) { setCount(target ?? 0); return; }
    const timeout = setTimeout(() => {
      const duration = 900;
      const steps = 40;
      const step = target / steps;
      const interval = duration / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(current));
      }, interval);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, loading, delay]);
  return count;
}

// The ring around a card's icon — an SVG circle whose stroke-dashoffset is
// transitioned from "fully hidden" to "fully drawn" via a one-shot CSS
// transition (not a looping @keyframes spinner), same as the reference.
// Resets to empty the moment `loading` goes true, so it visibly re-fills
// 0% -> 100% every time that row's filter re-fetches, not just on mount.
function CircleRing({ color, size = 46, loading, delay = 0 }) {
  const [filled, setFilled] = useState(false);
  const r = (size / 2) - 3;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (loading) { setFilled(false); return; }
    const t = setTimeout(() => setFilled(true), delay);
    return () => clearTimeout(t);
  }, [loading, delay]);

  return (
    <svg width={size} height={size} className="card-ring-svg">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color + '22'} strokeWidth="2.5" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={filled ? 0 : circ}
        style={{ transition: filled ? 'stroke-dashoffset 1.2s ease' : 'none' }}
      />
    </svg>
  );
}

// One dashboard stat card — a real component (not a plain function called
// from .map()) specifically so useCountUp/CircleRing's hooks are legal:
// each card gets its own hook instance instead of all of them sharing
// Dashboard's single render pass.
function StatCard({ card, isLoading, index }) {
  const count = useCountUp(card.value, isLoading, index * 60);
  return (
    <div className="stat-card">
      <div className="card-top">
        <div className="card-icon-wrapper">
          <CircleRing color={card.color} loading={isLoading} delay={index * 60 + 80} />
          <div className="card-icon-inner" style={{ background: `${card.color}15`, color: card.color }}>
            {card.icon}
          </div>
        </div>
        <div className={`trend-badge ${card.isUp ? 'up' : 'down'}`}>
          {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {card.trend}
        </div>
      </div>
      <div className="card-content">
        <span className="card-title">{card.title}</span>
        <div className="card-value">{count.toLocaleString()}{card.suffix || ''}</div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    reviews: 0,
    contacts: 0,
    inStock: 0,
    delivered: 0,
    cancelled: 0,
    newEnquiries: 0,
    newWhatsapp: 0,
    totalEnquiries: 0,
    pendingReviews: 0,
    notStarted: 0,
    inProduction: 0,
    totalVisitors: 0,
    product_trend: 0,
    order_trend: 0,
    delivery_trend: 0,
    customer_trend: 0,
    review_trend: 0,
    visitor_trend: 0,
    enquiries_trend: 0
  });
  // Each card row gets its own independent period filter — changing one
  // only re-fetches and updates that row's cards, not the others.
  const [generalFilter, setGeneralFilter] = useState('all');
  const [enquiryFilter, setEnquiryFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  // Enquiry Channels' Week/Month toggle and Product Status's own dropdown
  // used to share one "timeFilter" state, so touching either one silently
  // moved the other too. Each chart now gets its own filter, exactly like
  // the card rows above — touching one never affects anything else.
  const [trafficFilter, setTrafficFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  // A specific month (1-12, current year) picked from that row's own month
  // dropdown — '' means "not using it", so the period filter above applies
  // instead. When set, it takes precedence over generalFilter/etc.
  const [generalMonth, setGeneralMonth] = useState('');
  const [enquiryMonth, setEnquiryMonth] = useState('');
  const [orderMonth, setOrderMonth] = useState('');
  // Per-row loading — true while that row's own filter fetch is in
  // flight, so its cards can show a spinner/skeleton instead of sitting
  // on stale numbers with no feedback during the network round-trip.
  const [generalLoading, setGeneralLoading] = useState(true);
  const [enquiryLoading, setEnquiryLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);
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

  // Product count per category, for the "Products by Category" bar chart —
  // computed client-side from the full product list, since the API doesn't
  // return a pre-aggregated breakdown.
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  // Shared by the global fetch and each row's own filter fetch — hits the
  // same endpoint with whatever period that caller cares about. `month`
  // (1-12), when given, overrides `filterType` entirely on the backend.
  const fetchNotifications = async (filterType, month) => {
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Token ${token}` } : {};
    const monthParam = month ? `&month=${month}` : '';
    const res = await fetch(`${SITE_CONTENT.api.base}/api/notifications/?filter=${filterType}${monthParam}`, { headers });
    if (res.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/login';
      return null;
    }
    return res.ok ? res.json() : null;
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
    const imgPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${imgPath}`;
  };

  // Runs once on mount — products list (Top Selling + category bar chart)
  // and the monthly order trend (Order Analytics) don't vary by any filter
  // on the backend, so they don't need to be tied to one or re-fetched
  // every time some other filter changes. Every stat card field is fully
  // covered by the three row effects below; this no longer touches `stats`
  // at all, so nothing here can silently overwrite a row's own numbers.
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Token ${token}` } : {};

        const notifyData = await fetchNotifications('all');
        const productsRes = await fetch(`${SITE_CONTENT.api.base}/api/products/`, { headers });

        if (productsRes.status === 401) {
          // Stale token from different environment (e.g. Render vs Local)
          sessionStorage.clear();
          localStorage.clear();
          window.location.href = '/login';
          return;
        }

        if (notifyData && productsRes.ok) {
          const productsData = await productsRes.json();

          // Handle paginated or non-paginated product data
          const productItems = Array.isArray(productsData) ? productsData : (productsData.results || []);

          setProducts(productItems.slice(0, 5));

          // Group the full product list by category for the bar chart —
          // done from productItems (pre-slice), so it reflects everything,
          // not just the 5 rows shown in Top Selling.
          const categoryCounts = productItems.reduce((acc, p) => {
            const name = p.category_name || 'Uncategorized';
            acc[name] = (acc[name] || 0) + 1;
            return acc;
          }, {});
          setCategoryDistribution(
            Object.entries(categoryCounts)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
          );

          setAnalyticsData((notifyData.stats || {}).monthly_orders || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Enquiry Channels' own Week/Month toggle — updates only its traffic bars.
  useEffect(() => {
    let cancelled = false;
    fetchNotifications(trafficFilter).then((data) => {
      if (cancelled || !data) return;
      const s = data.stats || {};
      if (s.traffic_stats) setTrafficData(s.traffic_stats);
    });
    return () => { cancelled = true; };
  }, [trafficFilter]);

  // Product Status's own dropdown — updates only its pipeline bars.
  useEffect(() => {
    let cancelled = false;
    fetchNotifications(productStatusFilter).then((data) => {
      if (cancelled || !data) return;
      const s = data.stats || {};
      if (s.sales_pipeline) {
        setProductSalesData([
          { name: 'Not Started', value: s.sales_pipeline.packed || 0, trend: '+0%' },
          { name: 'In Production', value: s.sales_pipeline.shipped || 0, trend: '+0%' },
          { name: 'Delivered', value: s.sales_pipeline.delivered || 0, trend: '+0%' },
          { name: 'Cancelled', value: s.sales_pipeline.cancelled || 0, trend: '+0%', isNegative: true },
        ]);
      }
    });
    return () => { cancelled = true; };
  }, [productStatusFilter]);

  // General row's own filter — updates only the General cards.
  useEffect(() => {
    let cancelled = false;
    setGeneralLoading(true);
    fetchNotifications(generalFilter, generalMonth).then((data) => {
      if (cancelled) return;
      if (data) {
        const s = data.stats || {};
        setStats((prev) => ({
          ...prev,
          products: s.total_products ?? prev.products,
          product_trend: s.product_trend ?? prev.product_trend,
          inStock: s.in_stock ?? prev.inStock,
          reviews: s.total_reviews ?? prev.reviews,
          review_trend: s.review_trend ?? prev.review_trend,
          pendingReviews: data.reviews ?? prev.pendingReviews,
          totalVisitors: s.total_visitors ?? prev.totalVisitors,
          visitor_trend: s.visitor_trend ?? prev.visitor_trend
        }));
      }
      setGeneralLoading(false);
    });
    return () => { cancelled = true; };
  }, [generalFilter, generalMonth]);

  // Enquiries row's own filter — updates only the Enquiries cards.
  useEffect(() => {
    let cancelled = false;
    setEnquiryLoading(true);
    fetchNotifications(enquiryFilter, enquiryMonth).then((data) => {
      if (cancelled) return;
      if (data) {
        const s = data.stats || {};
        setStats((prev) => ({
          ...prev,
          contacts: s.total_customers ?? data.total_notifications ?? prev.contacts,
          customer_trend: s.customer_trend ?? prev.customer_trend,
          newEnquiries: data.enquiries ?? prev.newEnquiries,
          newWhatsapp: data.whatsapp_contacts ?? prev.newWhatsapp,
          totalEnquiries: s.total_enquiries ?? prev.totalEnquiries,
          enquiries_trend: s.enquiries_trend ?? prev.enquiries_trend
        }));
      }
      setEnquiryLoading(false);
    });
    return () => { cancelled = true; };
  }, [enquiryFilter, enquiryMonth]);

  // Orders row's own filter — updates only the Orders cards.
  useEffect(() => {
    let cancelled = false;
    setOrderLoading(true);
    fetchNotifications(orderFilter, orderMonth).then((data) => {
      if (cancelled) return;
      if (data) {
        const s = data.stats || {};
        setStats((prev) => ({
          ...prev,
          orders: s.total_confirmed ?? prev.orders,
          order_trend: s.order_trend ?? prev.order_trend,
          delivered: s.total_delivered ?? prev.delivered,
          delivery_trend: s.delivery_trend ?? prev.delivery_trend,
          cancelled: (s.sales_pipeline && s.sales_pipeline.cancelled) ?? prev.cancelled,
          notStarted: (s.sales_pipeline && s.sales_pipeline.packed) ?? prev.notStarted,
          inProduction: (s.sales_pipeline && s.sales_pipeline.shipped) ?? prev.inProduction
        }));
      }
      setOrderLoading(false);
    });
    return () => { cancelled = true; };
  }, [orderFilter, orderMonth]);

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

  // Cards are grouped into three sections (General → Enquiries → Orders) so
  // the dashboard reads top-to-bottom as: the business at a glance, who's
  // reaching out, then what's actually being sold/fulfilled.
  const generalCards = [
    {
      title: 'Total Visitors',
      // Distinct visitors (by hashed IP) who loaded the public storefront
      // in this period — logged by App.js on app mount, counted server-
      // side in NotificationAPIView. Doesn't include admin panel use.
      value: stats.totalVisitors,
      trend: `${stats.visitor_trend > 0 ? '+' : ''}${stats.visitor_trend}%`,
      isUp: stats.visitor_trend >= 0,
      icon: <Eye size={20} />,
      color: '#0891b2'
    },
    {
      title: 'Total Products',
      value: stats.products,
      trend: `${stats.product_trend > 0 ? '+' : ''}${stats.product_trend}%`,
      isUp: stats.product_trend >= 0,
      icon: <Package size={20} />,
      color: '#7c3aed'
    },
    {
      title: 'In Stock',
      value: stats.inStock,
      trend: '+0%',
      isUp: true,
      icon: <PackageCheck size={20} />,
      color: '#10b981'
    },
    {
      title: 'Out of Stock',
      value: Math.max(stats.products - stats.inStock, 0),
      trend: '+0%',
      isUp: false,
      icon: <PackageX size={20} />,
      color: '#ef4444'
    },
    {
      title: 'Client Reviews',
      value: stats.reviews,
      trend: `${stats.review_trend > 0 ? '+' : ''}${stats.review_trend}%`,
      isUp: stats.review_trend >= 0,
      icon: <MessageSquare size={20} />,
      color: '#8b5e3c'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      trend: '+0%',
      isUp: true,
      icon: <Clock size={20} />,
      color: '#f59e0b'
    }
  ];

  const enquiryCards = [
    {
      title: 'Total Customers',
      value: stats.contacts,
      trend: `${stats.customer_trend > 0 ? '+' : ''}${stats.customer_trend}%`,
      isUp: stats.customer_trend >= 0,
      icon: <Users size={20} />,
      color: '#3b82f6'
    },
    {
      title: 'Total Enquiry',
      // Web Enquiry records for the period on their own — unlike Total
      // Customers (which also folds in WhatsApp) and New Enquiries (which
      // is only the unread subset), this is every enquiry received.
      value: stats.totalEnquiries,
      trend: `${stats.enquiries_trend > 0 ? '+' : ''}${stats.enquiries_trend}%`,
      isUp: stats.enquiries_trend >= 0,
      icon: <ClipboardList size={20} />,
      color: '#6366f1'
    },
    {
      title: 'New Enquiries',
      value: stats.newEnquiries,
      trend: '+0%',
      isUp: true,
      icon: <Inbox size={20} />,
      color: '#0ea5e9'
    },
    {
      title: 'New WhatsApp Contacts',
      value: stats.newWhatsapp,
      trend: '+0%',
      isUp: true,
      icon: <Smartphone size={20} />,
      color: '#22c55e'
    },
    {
      title: 'Conversion Rate',
      // Share of total customers (enquiries + WhatsApp) that turned into a
      // confirmed order — the one figure that says whether enquiries are
      // actually converting, not just how many came in.
      value: stats.contacts > 0 ? Math.round((stats.orders / stats.contacts) * 100) : 0,
      suffix: '%',
      trend: '+0%',
      isUp: true,
      icon: <TrendingUp size={20} />,
      color: '#a855f7'
    },
    {
      title: 'WhatsApp Share',
      // What fraction of all enquiry/feedback interactions came in over
      // WhatsApp specifically — pulled straight from the same traffic
      // breakdown the Enquiry Channels chart already shows.
      value: (trafficData.find((t) => t.name === 'WhatsApp') || {}).value || 0,
      suffix: '%',
      trend: '+0%',
      isUp: true,
      icon: <Smartphone size={20} />,
      color: '#22c55e'
    }
  ];

  const orderCards = [
    {
      title: 'Not Started',
      value: stats.notStarted,
      trend: '+0%',
      isUp: true,
      icon: <PackagePlus size={20} />,
      color: '#64748b'
    },
    {
      title: 'In Production',
      value: stats.inProduction,
      trend: '+0%',
      isUp: true,
      icon: <Factory size={20} />,
      color: '#3b82f6'
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
      title: 'Cancelled Orders',
      value: stats.cancelled,
      trend: '+0%',
      isUp: false,
      icon: <CircleX size={20} />,
      color: '#ef4444'
    }
  ];

  // Monthly total enquiry volume (Web + WhatsApp combined) for the line
  // chart — analyticsData already carries Confirmed/Cancelled/Pending per
  // month, and every enquiry sits in exactly one bucket, so the three sum
  // to that month's total.
  const monthlyEnquiryTrend = analyticsData.map((m) => ({
    name: m.name,
    total: (m.Confirmed || 0) + (m.Cancelled || 0) + (m.Pending || 0)
  }));

  // Same 4 pipeline stages as the Product Status bars, colored to match
  // their card counterparts, for the pie chart.
  const pipelineColors = {
    'Not Started': '#64748b',
    'In Production': '#3b82f6',
    'Delivered': '#f59e0b',
    'Cancelled': '#ef4444'
  };

  // Same look as the original top-right "All Time" dropdown, just
  // recolored to match each section's eyebrow accent.
  const filterSelectStyle = (bg) => ({
    padding: '6px 26px 6px 12px',
    background: bg,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '13px',
    marginLeft: 'auto',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px top 50%',
    backgroundSize: '9px auto'
  });

  const PeriodFilterOptions = () => (
    <>
      <option value="all">All Time</option>
      <option value="yearly">Yearly</option>
      <option value="monthly">Monthly</option>
      <option value="weekly">Weekly</option>
      <option value="today">Today Date wise</option>
    </>
  );

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // A second, independent dropdown per row — pick any specific month of
  // the current year. When set, it overrides that row's period filter
  // above (see fetchNotifications/the row effects); "All Months" clears
  // it back to whatever the period filter says.
  const MonthFilterOptions = () => (
    <>
      <option value="">All Months</option>
      {MONTH_NAMES.map((name, i) => (
        <option key={i} value={i + 1}>{name}</option>
      ))}
    </>
  );

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
      {/* The old standalone "All Time" control here was removed — it sat
          directly above the General row's own filter and duplicated it
          visually. Enquiry Channels' Week/Month toggle and Product
          Status's own select each have their own independent filter now
          (trafficFilter / productStatusFilter) — neither affects the
          other, or anything else on the page. */}

      {/* CARD ROWS — General, then Enquiries, then Orders, all as plain
          stat-card rows, one after another. Charts/tables come after all
          three, not interleaved between them. */}
      <section className="dash-section dash-section--general">
        <div className="dash-section-head">
          <span className="dash-eyebrow">General</span>
          <span className="dash-section-sub">Business at a glance</span>
          <select
            value={generalFilter}
            onChange={(e) => setGeneralFilter(e.target.value)}
            style={filterSelectStyle('#7c3aed')}
          >
            <PeriodFilterOptions />
          </select>
          <select
            value={generalMonth}
            onChange={(e) => setGeneralMonth(e.target.value)}
            style={{ ...filterSelectStyle('#7c3aed'), marginLeft: '8px' }}
          >
            <MonthFilterOptions />
          </select>
        </div>
        <div className="stats-grid">
          {generalCards.map((card, i) => <StatCard key={i} card={card} isLoading={generalLoading} index={i} />)}
        </div>
      </section>

      <section className="dash-section dash-section--enquiry">
        <div className="dash-section-head">
          <span className="dash-eyebrow">Enquiries</span>
          <span className="dash-section-sub">Who's reaching out</span>
          <select
            value={enquiryFilter}
            onChange={(e) => setEnquiryFilter(e.target.value)}
            style={filterSelectStyle('#10b981')}
          >
            <PeriodFilterOptions />
          </select>
          <select
            value={enquiryMonth}
            onChange={(e) => setEnquiryMonth(e.target.value)}
            style={{ ...filterSelectStyle('#10b981'), marginLeft: '8px' }}
          >
            <MonthFilterOptions />
          </select>
        </div>
        <div className="stats-grid">
          {enquiryCards.map((card, i) => <StatCard key={i} card={card} isLoading={enquiryLoading} index={i} />)}
        </div>
      </section>

      <section className="dash-section dash-section--orders">
        <div className="dash-section-head">
          <span className="dash-eyebrow">Orders</span>
          <span className="dash-section-sub">What's being sold and fulfilled</span>
          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            style={filterSelectStyle('#f59e0b')}
          >
            <PeriodFilterOptions />
          </select>
          <select
            value={orderMonth}
            onChange={(e) => setOrderMonth(e.target.value)}
            style={{ ...filterSelectStyle('#f59e0b'), marginLeft: '8px' }}
          >
            <MonthFilterOptions />
          </select>
        </div>
        <div className="stats-grid">
          {orderCards.map((card, i) => <StatCard key={i} card={card} isLoading={orderLoading} index={i} />)}
        </div>
      </section>

      {/* ANALYTICS — every chart and table together, after all the card rows */}
      <section className="dash-section dash-section--analytics">
        <div className="dash-section-head">
          <span className="dash-eyebrow">Analytics</span>
          <span className="dash-section-sub">Trends and useful charts</span>
        </div>

        <div className="charts-row">
          <div className="chart-card traffic-card">
            <div className="chart-header">
              <h3>Enquiry Channels</h3>
              <div className="time-toggle">
                <button
                  className={trafficFilter === 'weekly' ? 'active' : ''}
                  onClick={() => setTrafficFilter('weekly')}
                >Week</button>
                <button
                  className={trafficFilter === 'monthly' ? 'active' : ''}
                  onClick={() => setTrafficFilter('monthly')}
                >Month</button>
              </div>
            </div>
            <div className="traffic-bar-container">
              {trafficData.map((item, i) => (
                <div className="traffic-bar-row" key={i}>
                  <div className="traffic-bar-label">
                    <span className="dot" style={{ background: item.color }}></span>
                    {item.name}
                  </div>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${Math.max(item.value, 2)}%`, background: item.color }}></div>
                  </div>
                  <span className="traffic-bar-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

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
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="Confirmed" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorConfirmed)" animationDuration={1500} />
                  <Area type="monotone" dataKey="Pending" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorPending)" animationDuration={1800} />
                  <Area type="monotone" dataKey="Cancelled" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCancelled)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Monthly Enquiry Trend</h3>
              <span className="date-badge">{new Date().getFullYear()}</span>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyEnquiryTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" name="Enquiries" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Order Pipeline Split</h3>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={productSalesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {productSalesData.map((entry, i) => (
                      <Cell key={i} fill={pipelineColors[entry.name] || '#9ca3af'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Products by Category</h3>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={categoryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Products" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bottom-row">
          <div className="table-card">
            <div className="table-header">
              <h3>Top Selling</h3>
              <div className="table-actions">
                <button className="filter-btn" onClick={handleSort}>
                  <Filter size={14} /> Sort by: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                </button>
                <button className="filter-btn" onClick={handleExportCSV}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Product info</th>
                  <th>Category</th>
                  <th>Stock Since</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={i}>
                    <td><span style={{ fontWeight: 'bold', color: '#9ca3af', width: '30px', display: 'inline-block' }}>{i + 1}</span></td>
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
                    <td>{p.category_name}</td>
                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
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
                value={productStatusFilter}
                onChange={(e) => setProductStatusFilter(e.target.value)}
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
      </section>
    </div>
  );
};

export default Dashboard;
