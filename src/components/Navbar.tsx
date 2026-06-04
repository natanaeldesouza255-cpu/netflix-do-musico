import React, { useState } from 'react';
import { useApp, ScreenName } from '../context/AppContext';
import { lessonsData, equipmentsData } from '../data/mockData';
import { 
  Search, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon, 
  Compass, 
  BookOpen, 
  Users, 
  Radio, 
  ShoppingBag, 
  TrendingUp, 
  Award,
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    user, 
    isSubscriber, 
    currentScreen, 
    navigateTo, 
    logoutUser,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // LOGICA DE BUSCA
  const getSearchResults = () => {
    if (searchQuery.trim() === '') return [];
    
    const query = searchQuery.toLowerCase();
    
    const filteredLessons = lessonsData.filter(l => 
      l.title.toLowerCase().includes(query) || 
      l.description.toLowerCase().includes(query) ||
      l.category.toLowerCase().includes(query)
    ).map(l => ({ ...l, type: 'Aulas' as const }));

    const filteredEquips = equipmentsData.filter(e => 
      e.name.toLowerCase().includes(query) || 
      e.description.toLowerCase().includes(query) ||
      e.type.toLowerCase().includes(query)
    ).map(e => ({ ...e, type: 'Equipamentos' as const }));

    return [...filteredLessons, ...filteredEquips].slice(0, 6);
  };

  const results = getSearchResults();

  const handleResultClick = (item: any) => {
    setSearchQuery('');
    setShowSearchResults(false);
    
    if (item.type === 'Aulas') {
      navigateTo('CategoryPage', { category: item.category, activeLessonId: item.id });
    } else {
      navigateTo('EquipmentReviews', { activeEqId: item.id });
    }
  };

  const navItems = [
    { label: 'Início', screen: 'MemberHome' as const, icon: Compass },
    { label: 'Aulas', screen: 'CategoryPage' as const, icon: BookOpen, params: { category: 'Violão' } },
    { label: 'Comunidade', screen: 'CommunityPage' as const, icon: Users },
    { label: 'Lives', screen: 'LivePage' as const, icon: Radio },
    { label: 'Marketplace', screen: 'MarketplacePage' as const, icon: ShoppingBag },
    { label: 'Equipamentos', screen: 'EquipmentReviews' as const, icon: Award },
    { label: 'Evolução', screen: 'StudentProfile' as const, icon: TrendingUp }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-zinc-800/80 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* LOGO */}
        <button 
          onClick={() => navigateTo(isSubscriber ? 'MemberHome' : 'PublicHome')}
          className="flex items-center gap-2 font-heading text-lg sm:text-2xl font-extrabold tracking-tight text-white focus:outline-none"
        >
          <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            NETFLIX
          </span>
          <span className="text-xs sm:text-sm font-light text-cyan-400 border border-cyan-400/30 px-1.5 py-0.5 rounded uppercase tracking-widest bg-cyan-950/40">
            do Músico
          </span>
        </button>

        {/* BUSCA GLOBAL */}
        {isSubscriber && (
          <div className="relative hidden md:block w-72 lg:w-96">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                placeholder="Buscar aulas, equipamentos, categorias..."
                className="w-full rounded-full bg-zinc-900 border border-zinc-800 px-4 py-1.5 pl-10 text-sm text-zinc-200 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-500" />
            </div>

            {/* MODAL DE RESULTADOS DE BUSCA */}
            {showSearchResults && results.length > 0 && (
              <div className="absolute top-full mt-2 w-full glass-panel rounded-lg shadow-2xl border border-zinc-800 overflow-hidden z-50">
                <div className="p-2 text-xs font-semibold text-zinc-500 border-b border-zinc-850">
                  Resultados da Busca
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {results.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick(item)}
                      className="w-full text-left p-3 hover:bg-zinc-800/80 flex items-center justify-between border-b border-zinc-900/40 transition"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title || item.name}</div>
                        <div className="text-xs text-zinc-400 mt-0.5">{item.category || item.type}</div>
                      </div>
                      <span className="text-[10px] bg-purple-950/50 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-mono uppercase">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-6">
          {isSubscriber ? (
            <>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.screen;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigateTo(item.screen, item.params)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition focus:outline-none ${
                      isActive 
                        ? 'text-cyan-400 font-semibold' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}

              {/* PERFIL RESUMIDO (XP & SAIR) */}
              <div className="flex items-center gap-4 pl-4 border-l border-zinc-800">
                <button
                  onClick={() => navigateTo('StudentProfile')}
                  className="flex items-center gap-2 group focus:outline-none"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full border border-purple-500/40 object-cover group-hover:border-purple-400 transition"
                  />
                  <div className="text-left">
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white transition">
                      {user?.name}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-purple-400 font-mono">
                      <Zap className="h-2.5 w-2.5 fill-purple-400 animate-pulse" />
                      {user?.xp} XP
                    </div>
                  </div>
                </button>
                <button 
                  onClick={logoutUser}
                  className="text-zinc-500 hover:text-red-400 transition p-1.5 rounded-full hover:bg-zinc-900 focus:outline-none"
                  title="Sair da conta"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigateTo('PublicHome')}
                className={`text-sm font-medium transition ${currentScreen === 'PublicHome' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Início Público
              </button>
              <button 
                onClick={() => navigateTo('Login')}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-bold text-white rounded-full group bg-gradient-to-br from-purple-600 to-cyan-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <span className="relative px-5 py-1.5 transition-all ease-in duration-75 bg-zinc-950 rounded-full group-hover:bg-opacity-0">
                  Entrar na Plataforma
                </span>
              </button>
            </div>
          )}
        </div>

        {/* BOTÃO MOBILE */}
        <div className="flex items-center gap-3 lg:hidden">
          {isSubscriber && (
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-purple-950/40 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
              <Zap className="h-3 w-3 fill-purple-400 animate-pulse" />
              {user?.xp} XP
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-white focus:outline-none p-1"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* MENU MOBILE EXPANDIDO */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full glass-panel mt-4 rounded-xl border border-zinc-800/80 p-4 shadow-2xl flex flex-col gap-4 animate-fade-in">
          
          {/* BUSCA MOBILE */}
          {isSubscriber && (
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                placeholder="Buscar aulas, equipamentos..."
                className="w-full rounded-full bg-zinc-900 border border-zinc-800 px-4 py-2 pl-10 text-sm text-zinc-200 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />

              {/* BUSCA RESULTADOS MOBILE */}
              {showSearchResults && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full glass-panel rounded-lg shadow-2xl border border-zinc-800 overflow-hidden z-50">
                  {results.map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleResultClick(item);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-3 hover:bg-zinc-800/80 flex items-center justify-between border-b border-zinc-900/40"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white">{item.title || item.name}</div>
                        <div className="text-xs text-zinc-400">{item.category || item.type}</div>
                      </div>
                      <span className="text-[9px] bg-cyan-950 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full uppercase">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {isSubscriber ? (
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.screen;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigateTo(item.screen, item.params);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg text-left text-sm font-medium transition ${
                      isActive 
                        ? 'bg-cyan-950/40 border border-cyan-500/20 text-cyan-400' 
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}

              <div className="border-t border-zinc-850 mt-2 pt-3 flex items-center justify-between">
                <button
                  onClick={() => {
                    navigateTo('StudentProfile');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="h-10 w-10 rounded-full border border-purple-500/40 object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">{user?.name}</div>
                    <div className="text-xs text-purple-400 font-mono">{user?.email}</div>
                  </div>
                </button>
                <button 
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 bg-red-950/40 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-900/40 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  navigateTo('PublicHome');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 rounded-lg text-left text-sm font-medium ${currentScreen === 'PublicHome' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
              >
                Início Público
              </button>
              <button 
                onClick={() => {
                  navigateTo('Login');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-bold text-center"
              >
                Entrar na Plataforma
              </button>
            </div>
          )}

        </div>
      )}
    </nav>
  );
};
export default Navbar;
