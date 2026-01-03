
import React, { useState, useEffect } from 'react';
import { View, Trip, User } from './types';
import { storage } from './services/storage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import TripCard from './components/TripCard';
import ItineraryBuilder from './components/ItineraryBuilder';
import BudgetVisualizer from './components/BudgetVisualizer';
import { Plus, Search, Calendar, MapPin, ArrowLeft, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(storage.getUser());
  const [currentView, setCurrentView] = useState<View>(user ? View.DASHBOARD : View.LOGIN);
  const [trips, setTrips] = useState<Trip[]>(storage.getTrips());
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  useEffect(() => {
    storage.setUser(user);
    if (user) setTrips(storage.getTrips());
  }, [user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentView(View.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(View.LOGIN);
  };

  const saveTrip = (trip: Trip) => {
    storage.saveTrip(trip);
    setTrips(storage.getTrips());
  };

  const handleCreateTrip = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTrip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      description: formData.get('description') as string,
      coverImage: 'https://picsum.photos/seed/' + Math.random() + '/800/400',
      stops: [],
      totalBudget: 0,
      userId: user?.id || 'guest',
      isPublic: false
    };
    saveTrip(newTrip);
    setEditingTrip(newTrip);
    setCurrentView(View.ITINERARY_BUILDER);
  };

  const deleteTrip = (id: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      storage.deleteTrip(id);
      setTrips(storage.getTrips());
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case View.LOGIN:
        return <Login onLogin={handleLogin} />;

      case View.DASHBOARD:
        return (
          <Dashboard 
            user={user} 
            trips={trips} 
            onSetView={setCurrentView} 
            onSelectTrip={(trip) => { setEditingTrip(trip); setCurrentView(View.ITINERARY_VIEW); }} 
          />
        );

      case View.MY_TRIPS:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">My Trips</h1>
                <p className="text-slate-500">Manage and explore all your planned journeys.</p>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map(trip => (
                <TripCard 
                  key={trip.id} 
                  trip={trip} 
                  onDelete={deleteTrip} 
                  onView={(t) => { setEditingTrip(t); setCurrentView(View.ITINERARY_VIEW); }}
                  onEdit={(t) => { setEditingTrip(t); setCurrentView(View.ITINERARY_BUILDER); }}
                />
              ))}
              <button 
                onClick={() => setCurrentView(View.CREATE_TRIP)}
                className="h-[340px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 transition-all bg-white/50"
              >
                <Plus size={40} />
                <span className="font-bold">Plan New Journey</span>
              </button>
            </div>
          </div>
        );

      case View.CREATE_TRIP:
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
             <header>
              <h1 className="text-3xl font-bold text-slate-900">Start a New Trip</h1>
              <p className="text-slate-500 mt-2">Give your adventure a name and select your dates to begin.</p>
            </header>
            <form onSubmit={handleCreateTrip} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Trip Name</label>
                <input name="name" required placeholder="Summer in Europe 2024" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                  <input name="startDate" type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
                  <input name="endDate" type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
                <textarea name="description" rows={3} placeholder="A 2-week journey across the major capitals of Europe..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100">Create My Trip</button>
            </form>
          </div>
        );

      case View.ITINERARY_BUILDER:
        return editingTrip ? (
          <ItineraryBuilder 
            trip={editingTrip} 
            onUpdate={(updated) => { setEditingTrip(updated); saveTrip(updated); }} 
            onDone={() => setCurrentView(View.ITINERARY_VIEW)} 
          />
        ) : null;

      case View.ITINERARY_VIEW:
        return editingTrip ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentView(View.MY_TRIPS)} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft size={24} /></button>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{editingTrip.name}</h1>
                  <p className="text-slate-500 flex items-center gap-2">
                    <Calendar size={14} /> 
                    {new Date(editingTrip.startDate).toLocaleDateString()} - {new Date(editingTrip.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCurrentView(View.BUDGET)} className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50">Budget</button>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700"><Share2 size={18} /> Share Trip</button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-12">
                {editingTrip.stops.map((stop, idx) => (
                  <div key={stop.id} className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">{idx + 1}</div>
                      <h2 className="text-2xl font-bold text-slate-800">{stop.cityName}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stop.activities.map(act => (
                        <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">{act.type}</span>
                          <h4 className="font-bold text-slate-900 mb-2">{act.name}</h4>
                          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{act.description}</p>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <span className="text-sm font-bold text-slate-900">${act.cost}</span>
                            <span className="text-xs text-slate-400 font-medium">{act.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
                   <h3 className="font-bold text-slate-900 mb-4">Trip Summary</h3>
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-slate-500">Total Destinations</span>
                       <span className="text-sm font-bold text-slate-900">{editingTrip.stops.length} Cities</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-slate-500">Estimated Cost</span>
                       <span className="text-sm font-bold text-emerald-600">
                         ${editingTrip.stops.reduce((sum, s) => sum + s.stayCost + s.activities.reduce((a, act) => a + act.cost, 0), 0)}
                       </span>
                     </div>
                     <button onClick={() => setCurrentView(View.ITINERARY_BUILDER)} className="w-full py-3 border border-indigo-100 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">Edit Itinerary</button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : null;

      case View.BUDGET:
        return editingTrip ? <BudgetVisualizer trip={editingTrip} /> : <div>Please select a trip first.</div>;

      case View.PROFILE:
        return (
          <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Profile & Settings</h1>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                  {user?.name?.[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{user?.name}</h3>
                  <p className="text-slate-500">{user?.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-left transition-colors">
                  <h4 className="font-bold text-slate-900">Privacy</h4>
                  <p className="text-xs text-slate-500 mt-1">Manage shared itineraries</p>
                </button>
                <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-left transition-colors">
                  <h4 className="font-bold text-slate-900">Currency</h4>
                  <p className="text-xs text-slate-500 mt-1">USD - US Dollar</p>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView} user={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

export default App;
