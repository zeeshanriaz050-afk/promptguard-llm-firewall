import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Layers,
  ArrowRight,
  TrendingUp,
  RotateCw,
  Play,
  FileCheck2,
  Terminal,
} from 'lucide-react';
import { ShieldPatchResponse } from '../types';

interface ShieldPatchViewerProps {
  originalPrompt: string;
  shieldData: ShieldPatchResponse | null;
  isGeneratingShield: boolean;
  onGenerateShield: () => void;
  onVerifyShield: (shieldedPrompt: string) => void;
  onSendToSandbox: (shieldedPrompt: string) => void;
}

export const ShieldPatchViewer: React.FC<ShieldPatchViewerProps> = ({
  originalPrompt,
  shieldData,
  isGeneratingShield,
  onGenerateShield,
  onVerifyShield,
  onSendToSandbox,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'side-by-side' | 'shield-only'>('side-by-side');

  const handleCopy = () => {
    if (!shieldData?.shieldedPrompt) return;
    navigator.clipboard.writeText(shieldData.shieldedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Automated Defense Synthesizer
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Multi-Layer Prompt Hardening
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Auto-Shield &amp; Prompt Patch Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Converts your vulnerable system prompt into an enterprise-grade hardened system prompt
              with Delimiter Fencing, Instruction Immutability, Anti-Leakage Canary Clauses, and Role
              Pinning without altering your app's core functionality.
            </p>
          </div>

          <button
            onClick={onGenerateShield}
            disabled={isGeneratingShield || !originalPrompt.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {isGeneratingShield ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Fortified Shield...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Generate Fortified Shield</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {shieldData ? (
        <div className="space-y-6">
          {/* Defensive Architecture Layer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shieldData.defensiveLayers?.map((layer, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-cyan-900/40 bg-slate-900/80 shadow-md relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-white truncate">{layer.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {layer.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-400 flex items-center justify-between">
                  <span>MITIGATES</span>
                  <span className="bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    {layer.mitigates}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action & View Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">View Mode:</span>
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setActiveView('side-by-side')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    activeView === 'side-by-side'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Side-by-Side Diff
                </button>
                <button
                  onClick={() => setActiveView('shield-only')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    activeView === 'shield-only'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Shielded Only
                </button>
              </div>

              {shieldData.estimatedScoreGain && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Estimated Gain: {shieldData.estimatedScoreGain}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Fortified Prompt</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onSendToSandbox(shieldData.shieldedPrompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-violet-400" />
                <span>Test in Live Sandbox</span>
              </button>

              <button
                onClick={() => onVerifyShield(shieldData.shieldedPrompt)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Audit Fortified Prompt</span>
              </button>
            </div>
          </div>

          {/* Prompts Display Area */}
          {activeView === 'side-by-side' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Original Vulnerable Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Original (Unshielded) Prompt
                  </span>
                  <span className="text-slate-500 font-mono">Vulnerable to Injections</span>
                </div>
                <div className="p-4 rounded-xl border border-rose-950/60 bg-slate-950/90 max-h-[500px] overflow-y-auto">
                  <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {originalPrompt}
                  </pre>
                </div>
              </div>

              {/* Right: Fortified Shielded Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Fortified Shielded System Prompt
                  </span>
                  <span className="text-cyan-400/80 font-mono text-[11px]">
                    Production Ready
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-cyan-800/80 bg-slate-950/90 max-h-[500px] overflow-y-auto shadow-inner shadow-cyan-950/30">
                  <pre className="text-xs font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed">
                    {shieldData.shieldedPrompt}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Fortified Shielded System Prompt
                </span>
                <span className="text-slate-400 font-mono">
                  {shieldData.shieldedPrompt.length} chars
                </span>
              </div>
              <div className="p-5 rounded-xl border border-cyan-800/80 bg-slate-950/90 max-h-[600px] overflow-y-auto shadow-inner">
                <pre className="text-xs sm:text-sm font-mono text-cyan-200/90 whitespace-pre-wrap leading-relaxed">
                  {shieldData.shieldedPrompt}
                </pre>
              </div>
            </div>
          )}

          {/* Hardening Checklist */}
          {shieldData.improvements && shieldData.improvements.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                Security Mitigations Applied
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {shieldData.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No Shield Generated Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Click the "Generate Fortified Shield" button above to analyze your system prompt and
            synthesize an enterprise-hardened defense layer against injection attacks.
          </p>
        </div>
      )}
    </div>
  );
};
