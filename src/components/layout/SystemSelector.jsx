import React, { useState, useRef, useEffect } from 'react';
import { useSystem } from '../../context/SystemContext';
import { ChevronDown, Check, Layers, Eye } from 'lucide-react';

export function SystemSelector({ variant = 'default', isCollapsed = false }) {
  const { currentSystem, switchSystem, systemsList } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const CurrentIcon = currentSystem.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSystem = (systemId) => {
    switchSystem(systemId, true);
    setIsOpen(false);
  };

  // Header compact pill style
  if (variant === 'header') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all text-left shadow-xs"
        >
          <div className={`p-1 rounded-lg ${currentSystem.bgLight}`}>
            <CurrentIcon className="w-4 h-4" />
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
                {currentSystem.name}
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Active
              </span>
            </div>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Select System Module</span>
              <span className="text-[10px] text-indigo-500 font-semibold flex items-center gap-1">
                <Eye className="w-3 h-3" /> Unhides Pages
              </span>
            </div>
            <div className="space-y-1">
              {systemsList.map((sys) => {
                const SysIcon = sys.icon;
                const isSelected = sys.id === currentSystem.id;
                return (
                  <button
                    key={sys.id}
                    onClick={() => handleSelectSystem(sys.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${sys.bgLight}`}>
                        <SysIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{sys.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">{sys.badge}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Sidebar expanded / collapsed style
  return (
    <div className="relative px-3 py-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-slate-200 ${
          isCollapsed ? 'justify-center px-2' : ''
        }`}
        title={isCollapsed ? `Active System: ${currentSystem.name}` : undefined}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className={`p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0`}>
            <CurrentIcon className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="text-left truncate">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">System Module</span>
              <h3 className="text-xs font-bold text-white truncate">{currentSystem.name}</h3>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 overflow-hidden ${
            isCollapsed ? 'left-16 top-0 w-64' : 'left-3 right-3 top-full mt-2'
          }`}
        >
          <div className="px-3 py-2 border-b border-slate-800 mb-1 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Switch Active System</span>
            <Layers className="w-3 h-3 text-indigo-400" />
          </div>
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {systemsList.map((sys) => {
              const SysIcon = sys.icon;
              const isSelected = sys.id === currentSystem.id;
              return (
                <button
                  key={sys.id}
                  onClick={() => handleSelectSystem(sys.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-800 text-slate-300'}`}>
                      <SysIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{sys.name}</p>
                      <p className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>{sys.badge}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
