import React, { useState } from 'react';
import { Header } from './components/Header';
import { AuditRunner } from './components/AuditRunner';
import { ShieldPatchViewer } from './components/ShieldPatchViewer';
import { FirewallSandbox } from './components/FirewallSandbox';
import { OwaspMatrix } from './components/OwaspMatrix';
import { PRESET_PROMPTS } from './data/presets';
import { BenchmarkReport, ShieldPatchResponse } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'audit' | 'shield' | 'sandbox' | 'owasp'>('audit');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ecommerce-bot');
  const [systemPrompt, setSystemPrompt] = useState<string>(PRESET_PROMPTS[0].prompt);

  const [report, setReport] = useState<BenchmarkReport | null>(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState<boolean>(false);

  const [shieldData, setShieldData] = useState<ShieldPatchResponse | null>(null);
  const [isGeneratingShield, setIsGeneratingShield] = useState<boolean>(false);

  // Preset Selection Handler
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (presetId === 'custom') {
      setSystemPrompt('');
      setReport(null);
      setShieldData(null);
      return;
    }
    const found = PRESET_PROMPTS.find((p) => p.id === presetId);
    if (found) {
      setSystemPrompt(found.prompt);
      setReport(null);
      setShieldData(null);
    }
  };

  // Run Automated Red-Teaming Benchmark
  const handleRunBenchmark = async (selectedAttacks?: string[]) => {
    if (!systemPrompt.trim() || isRunningBenchmark) return;

    setIsRunningBenchmark(true);
    try {
      const res = await fetch('/api/redteam/run-benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          selectedAttacks,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to run benchmark');
      }

      const data: BenchmarkReport = await res.json();
      setReport(data);
    } catch (err) {
      console.error('Benchmark execution error:', err);
    } finally {
      setIsRunningBenchmark(false);
    }
  };

  // Generate Auto-Shield Patch
  const handleGenerateShield = async () => {
    if (!systemPrompt.trim() || isGeneratingShield) return;

    setIsGeneratingShield(true);
    try {
      const vulnerabilitySummary = report
        ? `Found ${report.stats.breached} breached vectors and ${report.stats.suspicious} suspicious vectors. Breached tests: ${report.results
            .filter((r) => r.status === 'BREACHED')
            .map((r) => r.name)
            .join(', ')}`
        : 'General prompt hardening against injection, prompt leakage, and roleplay bypass.';

      const res = await fetch('/api/shield/generate-patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalPrompt: systemPrompt,
          vulnerabilitySummary,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to synthesize shield');
      }

      const data: ShieldPatchResponse = await res.json();
      setShieldData(data);
    } catch (err) {
      console.error('Shield generation error:', err);
    } finally {
      setIsGeneratingShield(false);
    }
  };

  // Switch to shield tab and auto-generate if not yet present
  const handleNavigateToShield = () => {
    setActiveTab('shield');
    if (!shieldData) {
      handleGenerateShield();
    }
  };

  // Verify Shield by running benchmark on the shielded prompt
  const handleVerifyShield = (shieldedPromptText: string) => {
    setSystemPrompt(shieldedPromptText);
    setActiveTab('audit');
    // Run benchmark with shielded text
    setTimeout(() => {
      handleRunBenchmark();
    }, 150);
  };

  // Send shielded prompt to sandbox
  const handleSendToSandbox = (_shieldedPromptText: string) => {
    setActiveTab('sandbox');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'audit' && (
          <AuditRunner
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
            report={report}
            isRunning={isRunningBenchmark}
            onRunBenchmark={handleRunBenchmark}
            onNavigateToShield={handleNavigateToShield}
          />
        )}

        {activeTab === 'shield' && (
          <ShieldPatchViewer
            originalPrompt={systemPrompt}
            shieldData={shieldData}
            isGeneratingShield={isGeneratingShield}
            onGenerateShield={handleGenerateShield}
            onVerifyShield={handleVerifyShield}
            onSendToSandbox={handleSendToSandbox}
          />
        )}

        {activeTab === 'sandbox' && (
          <FirewallSandbox
            unshieldedPrompt={systemPrompt}
            shieldedPrompt={shieldData?.shieldedPrompt || null}
            onNavigateToShield={handleNavigateToShield}
          />
        )}

        {activeTab === 'owasp' && <OwaspMatrix />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-mono text-slate-400">
              PromptGuard LLM Firewall &amp; Red-Teaming Suite
            </span>
          </div>
          <p className="text-slate-500">
            Defense-in-depth for AI applications • Compliant with OWASP Top 10 for LLMs
          </p>
        </div>
      </footer>
    </div>
  );
}
