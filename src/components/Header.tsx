import React from 'react';
import { Shield, ShieldAlert, Zap, BookOpen, Terminal, Sparkles, Cpu } from 'lucide-react';
import { PRESET_PROMPTS } from '../data/presets';

interface HeaderProps {
  activeTab: 'audit' | 'shield' | 'sandbox' | 'owasp';
  setActiveTab: (tab: 'audit' | 'shield' | 'sandbox' | 'owasp') => void;
  onSelectPreset: (presetId: string) => void;
  selectedPresetId: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectPreset,
  selectedPresetId,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-white" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-tight text-lg text-white">
                  PromptGuard<span className="text-emerald-400">.sec</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                  LLM Firewall
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Jailbreak Shield Tester &amp; Red-Teaming Sandbox
              </p>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Target App:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 max-w-[240px] truncate"
            >
              <option value="custom">Custom System Prompt...</option>
              {PRESET_PROMPTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'audit'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Red-Team Audit</span>
            </button>

            <button
              onClick={() => setActiveTab('shield')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'shield'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Shield</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30 shadow-sm shadow-violet-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Firewall Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('owasp')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'owasp'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="OWASP LLM Matrix"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">OWASP Matrix</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
