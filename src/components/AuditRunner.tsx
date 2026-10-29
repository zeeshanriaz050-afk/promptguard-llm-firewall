import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCw,
  Sparkles,
  Download,
  ChevronDown,
  ChevronUp,
  FileCode,
  CheckCircle2,
  XCircle,
  Copy,
  Info,
  Bug,
} from 'lucide-react';
import { BenchmarkReport, TestResult } from '../types';
import { BENCHMARK_ATTACKS } from '../data/benchmarkAttacks';

interface AuditRunnerProps {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  report: BenchmarkReport | null;
  isRunning: boolean;
  onRunBenchmark: (selectedAttacks?: string[]) => void;
  onNavigateToShield: () => void;
}

export const AuditRunner: React.FC<AuditRunnerProps> = ({
  systemPrompt,
  setSystemPrompt,
  report,
  isRunning,
  onRunBenchmark,
  onNavigateToShield,
}) => {
  const [selectedAttackIds, setSelectedAttackIds] = useState<string[]>(
    BENCHMARK_ATTACKS.map((a) => a.id)
  );
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  const [copiedPayloadId, setCopiedPayloadId] = useState<string | null>(null);

  const toggleAttack = (id: string) => {
    setSelectedAttackIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllAttacks = () => setSelectedAttackIds(BENCHMARK_ATTACKS.map((a) => a.id));
  const deselectAllAttacks = () => setSelectedAttackIds([]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayloadId(id);
    setTimeout(() => setCopiedPayloadId(null), 2000);
  };

  const exportReport = (format: 'markdown' | 'json') => {
    if (!report) return;

    let content = '';
    let filename = `promptguard-audit-report-${Date.now()}`;

    if (format === 'json') {
      content = JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          systemPrompt,
          securityScore: report.securityScore,
          grade: report.grade,
          stats: report.stats,
          tests: report.results,
        },
        null,
        2
      );
      filename += '.json';
    } else {
      content = `# PromptGuard Security Audit & Red-Teaming Report
Generated: ${new Date().toUTCString()}
Security Score: ${report.securityScore} / 100 (Grade: ${report.grade})

## Target System Prompt
\`\`\`
${systemPrompt}
\`\`\`

## Executive Summary
- Total Tests Run: ${report.stats.total}
- Breached: ${report.stats.breached}
- Suspicious: ${report.stats.suspicious}
- Resisted: ${report.stats.resisted}

## Detailed Vulnerability Breakdown
${report.results
  .map(
    (r, i) => `
### ${i + 1}. ${r.name} [${r.status}]
- **OWASP Category**: ${r.owaspId}
- **Severity**: ${r.severity}
- **Vulnerability Reason**: ${r.reason}
- **Attack Payload**:
\`\`\`
${r.payload}
\`\`\`
- **Model Output**:
\`\`\`
${r.output}
\`\`\`
`
  )
  .join('\n')}
`;
      filename += '.md';
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 75) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (score >= 55) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-500 border-rose-500/40 bg-rose-500/10';
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'BREACHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 border border-rose-500/50 text-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            BREACHED
          </span>
        );
      case 'SUSPICIOUS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/50 text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            SUSPICIOUS
          </span>
        );
      case 'RESISTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            DEFENDED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[11px] font-mono font-medium uppercase tracking-wider rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Automated Red-Teaming Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">
                OWASP LLM Top 10 Security Audit
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              AI Prompt Security &amp; Jailbreak Vulnerability Tester
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Paste your application's system prompt or chatbot instructions below. PromptGuard will
              simulate a series of adversarial attacks (direct override, verbatim extraction, DAN
              roleplay, delimiter hijacking, and exfiltration) to compute your LLM resilience score.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onRunBenchmark(selectedAttackIds)}
              disabled={isRunning || !systemPrompt.trim()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Auditing System Prompt...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Launch Red-Team Audit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Prompt Editor & Attack Vectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target System Prompt */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <label className="text-sm font-semibold text-slate-200">
                Target AI System Prompt
              </label>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>{systemPrompt.length} chars</span>
              <span>•</span>
              <span>{systemPrompt.split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>

          <div className="relative rounded-xl border border-slate-700/80 bg-slate-950/90 shadow-inner group focus-within:border-emerald-500/60 transition-colors">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Paste your system prompt, AI instructions, or custom rules here..."
              rows={12}
              className="w-full bg-transparent text-slate-200 font-mono text-xs sm:text-sm p-4 focus:outline-none resize-y selection:bg-emerald-500/30 leading-relaxed"
            />
            {systemPrompt && (
              <button
                onClick={() => setSystemPrompt('')}
                className="absolute top-3 right-3 text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Tip: You can select real-world scenario presets from the top dropdown or type your own
            custom chatbot prompt.
          </p>
        </div>

        {/* Right Column: Attack Vectors Selection */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-semibold text-slate-200">
                Test Vectors ({selectedAttackIds.length}/{BENCHMARK_ATTACKS.length})
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={selectAllAttacks}
                className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
              >
                Select All
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={deselectAllAttacks}
                className="text-slate-400 hover:text-slate-300 cursor-pointer"
              >
                None
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {BENCHMARK_ATTACKS.map((attack) => {
              const isChecked = selectedAttackIds.includes(attack.id);
              return (
                <div
                  key={attack.id}
                  onClick={() => toggleAttack(attack.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-slate-900/90 border-slate-700 hover:border-emerald-500/40'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-400/20 bg-slate-800 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-medium text-slate-200 truncate">{attack.name}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                          attack.severity === 'CRITICAL'
                            ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                            : attack.severity === 'HIGH'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
                        }`}
                      >
                        {attack.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{attack.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>OWASP {attack.owaspId}</span>
                      <span>•</span>
                      <span className="uppercase">{attack.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Audit Report Section */}
      {report && (
        <div className="space-y-6 pt-4 border-t border-slate-800">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Score Card */}
            <div
              className={`p-5 rounded-2xl border flex items-center justify-between shadow-lg ${getScoreColor(
                report.securityScore
              )}`}
            >
              <div>
                <p className="text-xs uppercase font-mono tracking-wider font-semibold opacity-80">
                  Security Resilience
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {report.securityScore}%
                  </span>
                  <span className="text-xl font-bold font-mono">Grade {report.grade}</span>
                </div>
                <p className="text-xs mt-1.5 opacity-90">
                  {report.securityScore >= 80
                    ? 'High defense against basic attacks'
                    : report.securityScore >= 50
                    ? 'Moderate risk: several vectors breached'
                    : 'Critical vulnerabilities detected!'}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-current flex items-center justify-center font-bold text-lg font-mono">
                {report.grade}
              </div>
            </div>

            {/* Breached Metric */}
            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-rose-300 font-semibold">
                  Breaches Detected
                </span>
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-rose-400">
                  {report.stats.breached}
                </span>
                <span className="text-xs text-rose-300/80 ml-2">
                  / {report.stats.total} attacks
                </span>
              </div>
              <p className="text-[11px] text-slate-400">System prompt rules were bypassed.</p>
            </div>

            {/* Suspicious Metric */}
            <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-amber-300 font-semibold">
                  Ambiguous / Flagged
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-amber-400">
                  {report.stats.suspicious}
                </span>
                <span className="text-xs text-amber-300/80 ml-2">
                  / {report.stats.total} attacks
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Boundary held weakly; potential leak.</p>
            </div>

            {/* Resisted Metric */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-300 font-semibold">
                  Successfully Resisted
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-emerald-400">
                  {report.stats.resisted}
                </span>
                <span className="text-xs text-emerald-300/80 ml-2">
                  / {report.stats.total} attacks
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Instructions withstood adversarial payload.</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-300">
                Found {report.stats.breached + report.stats.suspicious} potential risks.
              </span>
              <span className="text-xs text-slate-500">
                Apply multi-layer defense fencing to harden this prompt.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportReport('markdown')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </button>
              <button
                onClick={() => exportReport('json')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={onNavigateToShield}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Shield / Patch Prompt</span>
              </button>
            </div>
          </div>

          {/* Detailed Attack Vectors Breakdown */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Detailed Vulnerability Diagnostics
            </h2>

            <div className="space-y-3">
              {report.results.map((result) => {
                const isExpanded = expandedResultId === result.id;
                return (
                  <div
                    key={result.id}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      result.status === 'BREACHED'
                        ? 'border-rose-900/60 bg-rose-950/10'
                        : result.status === 'SUSPICIOUS'
                        ? 'border-amber-900/60 bg-amber-950/10'
                        : 'border-slate-800 bg-slate-900/40'
                    }`}
                  >
                    {/* Header */}
                    <div
                      onClick={() => setExpandedResultId(isExpanded ? null : result.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {getStatusBadge(result.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-200 truncate">
                              {result.name}
                            </h3>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                              OWASP {result.owaspId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {result.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs font-mono font-medium ${
                            result.severity === 'CRITICAL'
                              ? 'text-rose-400'
                              : result.severity === 'HIGH'
                              ? 'text-amber-400'
                              : 'text-blue-400'
                          }`}
                        >
                          {result.severity}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Forensic Body */}
                    {isExpanded && (
                      <div className="p-4 pt-2 border-t border-slate-800/80 space-y-4 bg-slate-950/60">
                        {/* Reason / Forensic summary */}
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                          <span className="font-semibold text-slate-300 block mb-1">
                            Security Analysis:
                          </span>
                          <p className="text-slate-400 leading-relaxed">{result.reason}</p>
                        </div>

                        {/* Injected Attack Payload */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-mono font-medium text-slate-300">
                              Adversarial Injected Payload:
                            </span>
                            <button
                              onClick={() => copyToClipboard(result.payload, `payload-${result.id}`)}
                              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>
                                {copiedPayloadId === `payload-${result.id}` ? 'Copied!' : 'Copy Payload'}
                              </span>
                            </button>
                          </div>
                          <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-rose-300/90 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {result.payload}
                          </pre>
                        </div>

                        {/* Actual LLM Output */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-mono font-medium text-slate-300">
                              LLM Model Response:
                            </span>
                            <button
                              onClick={() => copyToClipboard(result.output, `output-${result.id}`)}
                              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>
                                {copiedPayloadId === `output-${result.id}` ? 'Copied!' : 'Copy Output'}
                              </span>
                            </button>
                          </div>
                          <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48">
                            {result.output}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
