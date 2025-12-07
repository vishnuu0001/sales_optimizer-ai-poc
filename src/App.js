import React, { useState, useEffect } from 'react';
import {
    LayoutGrid,
    Users,
    Car,
    Megaphone,
    Settings,
    TrendingUp,
    Zap,
    RefreshCw,
    Sparkles,
    Search,
    ArrowRight,
    Target,
    Bell,
    ChevronRight,
    MoreHorizontal,
    BarChart3,
    Calendar
} from 'lucide-react';

// --- 1. MOCK DATA & AI LOGIC ---

const CAR_MODELS = [
    { id: 'C-101', model: 'BMW i4', type: 'EV', price: 60000, stock: 12, demand_score: 94, img: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=100' },
    { id: 'C-102', model: 'Ford F-150 Lightning', type: 'Truck', price: 55000, stock: 8, demand_score: 88, img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=100' },
    { id: 'C-103', model: 'Hyundai Ioniq 5', type: 'SUV', price: 45000, stock: 24, demand_score: 72, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=100' },
    { id: 'C-104', model: 'Tesla Model 3', type: 'Sedan', price: 40000, stock: 5, demand_score: 98, img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=100' },
    { id: 'C-105', model: 'Toyota RAV4 Hybrid', type: 'SUV', price: 35000, stock: 18, demand_score: 65, img: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&q=80&w=100' }
];

const CAMPAIGNS = [
    { id: 'CMP-001', name: 'Q4 EV Clearance', channel: 'Email', target: 'High Budget', sentiment: 'Positive', conversion: 12.5, status: 'Active', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'CMP-002', name: 'Family SUV Promo', channel: 'SMS', target: 'Families > 4', sentiment: 'Neutral', conversion: 4.2, status: 'Active', color: 'bg-emerald-100 text-emerald-700' },
    { id: 'CMP-003', name: 'Loyalty Upgrade', channel: 'App', target: 'Previous Owners', sentiment: 'High', conversion: 18.0, status: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
    { id: 'CMP-004', name: 'Weekend Test Drive', channel: 'Social', target: 'Local < 20mi', sentiment: 'Mixed', conversion: 8.5, status: 'Paused', color: 'bg-slate-100 text-slate-600' },
];

const NAMES = ["James", "Emily", "Michael", "Sarah", "David", "Jessica", "Robert", "Jennifer", "William", "Lisa"];

// AI Sales Logic
const calculateSalesAi = (customer) => {
    const { budget, interest_level, last_interaction_days } = customer;

    const suitableModels = CAR_MODELS.filter(c => c.price <= budget * 1.3);
    const recommended = suitableModels.length > 0
        ? suitableModels[Math.floor(Math.random() * suitableModels.length)]
        : CAR_MODELS[4];

    let probability = interest_level * 10;
    probability -= (last_interaction_days * 1.5);
    if (budget >= recommended.price) probability += 15;
    probability = Math.max(5, Math.min(99, probability));

    let reasoning = "";
    if (probability > 80) reasoning = `Strong buy signals. Frequent engagement with ${recommended.model} assets. Financials pre-qualified.`;
    else if (probability > 50) reasoning = `Moderate interest. Comparison shopping detected against ${recommended.type} segment competitors.`;
    else reasoning = `Low urgency. Budget constraints identified for ${recommended.model}. Nurture campaign recommended.`;

    return {
        recommended_model: recommended.model,
        car_image: recommended.img,
        price: recommended.price,
        probability: Math.round(probability),
        ai_reasoning: reasoning
    };
};

const generateInitialLeads = (count = 12) => {
    return Array.from({ length: count }, (_, i) => {
        const customer = {
            id: `L-${2024 + i}`,
            name: `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${String.fromCharCode(65+i)}.`,
            email: `client.${i + 45}@gmail.com`,
            budget: 35000 + Math.floor(Math.random() * 40000),
            interest_level: 3 + Math.floor(Math.random() * 7),
            family_size: 1 + Math.floor(Math.random() * 5),
            last_interaction_days: Math.floor(Math.random() * 10),
            avatar_color: `hsl(${Math.random() * 360}, 70%, 80%)`
        };
        return { ...customer, ...calculateSalesAi(customer) };
    });
};

// --- 2. MODERN UI COMPONENTS ---

const NavItem = ({ icon: Icon, label, active, onClick, count }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
            active
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
            <span className="font-medium text-sm">{label}</span>
        </div>
        {count && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
        {count}
      </span>
        )}
    </button>
);

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card hover:shadow-lg transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          +{trend}% <TrendingUp size={12} className="ml-1" />
        </span>
            )}
        </div>
        <div>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
            <p className="text-slate-500 text-sm font-medium mt-1">{title}</p>
        </div>
    </div>
);

// --- 3. VIEWS ---

const PredictionsView = ({ leads, selectedLead, setSelectedLead }) => {
    const hotLeads = leads.filter(l => l.probability >= 90).length;
    const pipeline = leads.reduce((acc, l) => acc + (l.probability > 50 ? l.price : 0), 0);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Hot Leads (>90%)" value={hotLeads} trend={12} icon={Zap} color="amber" />
                <StatCard title="Pipeline Value" value={`$${(pipeline / 1000).toFixed(1)}k`} trend={8} icon={BarChart3} color="brand" />
                <StatCard title="Actions Ready" value={15} trend={5} icon={Sparkles} color="accent-purple" />
                <StatCard title="Conversion Rate" value="24.8%" trend={2} icon={Target} color="accent-teal" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
                {/* Main List */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                        <div>
                            <h3 className="font-bold text-lg text-slate-800">Live Lead Scoring</h3>
                            <p className="text-sm text-slate-400">AI-driven purchase probability updates</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Search size={20} /></button>
                            <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Settings size={20} /></button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-2">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase sticky top-0 backdrop-blur-sm">
                            <tr>
                                <th className="p-4 rounded-l-lg">Customer</th>
                                <th className="p-4">Probability</th>
                                <th className="p-4">Recommendation</th>
                                <th className="p-4 rounded-r-lg text-right">Action</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {leads.map((lead) => (
                                <tr
                                    key={lead.id}
                                    onClick={() => setSelectedLead(lead)}
                                    className={`group cursor-pointer transition-all duration-200 border-b border-slate-50 hover:bg-slate-50/80 rounded-lg ${selectedLead?.id === lead.id ? 'bg-brand-50 hover:bg-brand-50 border-brand-100' : ''}`}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 font-bold text-xs shadow-sm" style={{ backgroundColor: lead.avatar_color }}>
                                                {lead.name.split(' ')[0][0]}{lead.name.split(' ')[1][0]}
                                            </div>
                                            <div>
                                                <div className={`font-semibold ${selectedLead?.id === lead.id ? 'text-brand-700' : 'text-slate-700'}`}>{lead.name}</div>
                                                <div className="text-xs text-slate-400">{lead.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 w-48">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span className={`${lead.probability > 80 ? 'text-emerald-600' : 'text-slate-600'}`}>{lead.probability}% Match</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${
                                                        lead.probability > 85 ? 'bg-emerald-500' :
                                                            lead.probability > 50 ? 'bg-amber-400' : 'bg-slate-300'
                                                    }`}
                                                    style={{ width: `${lead.probability}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700">{lead.recommended_model}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="text-brand-600 hover:text-brand-700 hover:bg-brand-50 p-2 rounded-lg transition-colors">
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Card */}
                <div className={`w-96 flex-shrink-0 transition-all duration-300 ${selectedLead ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-50'}`}>
                    {selectedLead ? (
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 h-full flex flex-col overflow-hidden relative">
                            {/* Header with Bg */}
                            <div className="h-32 bg-gradient-to-r from-brand-600 to-accent-purple p-6 text-white relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold">{selectedLead.name}</h2>
                                    <p className="text-brand-100 text-sm opacity-90">ID: {selectedLead.id}</p>
                                </div>
                            </div>

                            {/* Overlapping Content */}
                            <div className="px-6 -mt-8 relative z-20 flex-1 flex flex-col">
                                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-50 mb-6">
                                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-brand-600 uppercase tracking-wider">
                                        <Sparkles size={14} /> AI Analysis
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">"{selectedLead.ai_reasoning}"</p>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recommendation</h4>
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <img src={selectedLead.car_image} alt="car" className="w-16 h-16 rounded-lg object-cover bg-white" />
                                                <div>
                                                    <div className="font-bold text-slate-800">{selectedLead.recommended_model}</div>
                                                    <div className="text-sm text-emerald-600 font-mono font-medium">${selectedLead.price.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-xs text-slate-400 mb-1">Budget</div>
                                            <div className="font-bold text-slate-700">${selectedLead.budget.toLocaleString()}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-lg">
                                            <div className="text-xs text-slate-400 mb-1">Family Size</div>
                                            <div className="font-bold text-slate-700">{selectedLead.family_size} Members</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-6 mt-auto">
                                    <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-200 flex justify-center items-center gap-2 transition-all active:scale-95">
                                        <Megaphone size={18} /> Generate Offer Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <Users size={48} className="mb-4 opacity-20" />
                            <p>Select a lead from the list to view detailed AI insights and recommendations.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InventoryView = () => (
    <div className="animate-fade-in grid grid-cols-1 gap-6">
        <div className="flex justify-between items-end">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Inventory Match</h2>
                <p className="text-slate-500">AI-driven demand forecasting for stock</p>
            </div>
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600">Filter: All</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600">Sort: Demand</span>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-100">
                <tr>
                    <th className="p-6">Vehicle Model</th>
                    <th className="p-6">Segment</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Stock Level</th>
                    <th className="p-6">Demand Score</th>
                    <th className="p-6 text-right">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {CAR_MODELS.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                    <img src={car.img} alt={car.model} className="w-full h-full object-cover" />
                                </div>
                                <span className="font-bold text-slate-700">{car.model}</span>
                            </div>
                        </td>
                        <td className="p-6"><span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">{car.type}</span></td>
                        <td className="p-6 font-mono text-slate-600">${car.price.toLocaleString()}</td>
                        <td className="p-6">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${car.stock < 10 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                <span className="font-medium text-slate-700">{car.stock} Units</span>
                            </div>
                        </td>
                        <td className="p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-24 bg-slate-100 rounded-full h-2">
                                    <div className={`h-full rounded-full ${car.demand_score > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${car.demand_score}%` }}></div>
                                </div>
                                <span className="font-bold text-slate-700">{car.demand_score}</span>
                            </div>
                        </td>
                        <td className="p-6 text-right">
                            <button className="text-brand-600 font-medium text-sm hover:underline flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                Match Leads <ArrowRight size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
);

const CampaignsView = () => (
    <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAMPAIGNS.map(camp => (
                <div key={camp.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-card hover:shadow-lg transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${camp.color.split(' ')[1]}`}>{camp.channel} Campaign</div>
                            <h3 className="text-xl font-bold text-slate-800">{camp.name}</h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${camp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {camp.status}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <div className="text-xs text-slate-400 mb-1">Target</div>
                            <div className="font-semibold text-slate-700 text-sm truncate">{camp.target}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <div className="text-xs text-slate-400 mb-1">Conversion</div>
                            <div className="font-bold text-emerald-600">{camp.conversion}%</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <div className="text-xs text-slate-400 mb-1">Sentiment</div>
                            <div className="font-bold text-brand-600">{camp.sentiment}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-brand-50 to-white border border-brand-100/50">
                        <div className="bg-white p-2 rounded-full shadow-sm text-brand-600">
                            <Sparkles size={16} />
                        </div>
                        <div className="text-xs text-slate-600">
                            <span className="font-bold text-brand-700">AI Insight: </span>
                            {camp.conversion > 10 ? 'High performace. Recommend scaling budget +15%.' : 'Engagement dropping. Update creative assets.'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- 4. MAIN LAYOUT ---

export default function App() {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [activeView, setActiveView] = useState('predictions');
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        setLeads(generateInitialLeads());
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setLeads(prevLeads => prevLeads.map(l => ({
                        ...l,
                        interest_level: Math.min(10, Math.max(1, l.interest_level + (Math.random() > 0.5 ? 1 : -1))),
                        ...calculateSalesAi(l)
                    })));
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-72 bg-dark-bg flex flex-col border-r border-slate-800 relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 left-0 w-full h-64 bg-brand-900/20 blur-3xl pointer-events-none"></div>

                <div className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-gradient-to-tr from-brand-500 to-accent-purple rounded-xl flex items-center justify-center shadow-glow">
                            <Zap className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">DealerAI</h1>
                            <p className="text-xs text-slate-400 font-medium">Sales Intelligence</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
                        <NavItem icon={LayoutGrid} label="Predictions" active={activeView === 'predictions'} onClick={() => setActiveView('predictions')} count="12" />
                        <NavItem icon={Car} label="Inventory Match" active={activeView === 'inventory'} onClick={() => setActiveView('inventory')} />
                        <NavItem icon={Megaphone} label="Campaigns" active={activeView === 'campaigns'} onClick={() => setActiveView('campaigns')} />
                        <NavItem icon={Settings} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
                    </div>
                </div>

                <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">JD</div>
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">John Doe</div>
                            <div className="text-xs text-slate-500">Sales Manager</div>
                        </div>
                        <button className="text-slate-400 hover:text-white"><MoreHorizontal size={16} /></button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span>Engine Live</span>
                        </div>
                        <span className="font-mono text-brand-400">{timeLeft}s</span>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-20">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-800">
                            {activeView === 'predictions' ? 'Sales Predictions' :
                                activeView === 'inventory' ? 'Inventory Intelligence' :
                                    activeView === 'campaigns' ? 'Active Campaigns' : 'Settings'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64 transition-all" />
                        </div>
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <button className="p-2 text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-full transition-colors" onClick={() => { setLeads(generateInitialLeads()); setTimeLeft(30); }}>
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    {/* Background Decorative Blob */}
                    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-50/50 to-transparent -z-10 pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto">
                        {activeView === 'predictions' && <PredictionsView leads={leads} selectedLead={selectedLead} setSelectedLead={setSelectedLead} />}
                        {activeView === 'inventory' && <InventoryView />}
                        {activeView === 'campaigns' && <CampaignsView />}
                        {activeView === 'settings' && (
                            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"><Settings size={32} /></div>
                                <h3 className="text-lg font-medium text-slate-600">System Settings</h3>
                                <p>Configuration panel would go here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}