export type AttackCategory =
  | 'direct_override'
  | 'leakage'
  | 'roleplay'
  | 'delimiter'
  | 'exfiltration'
  | 'obfuscation'
  | 'hypothetical';

export interface AttackVector {
  id: string;
  name: string;
  category: AttackCategory;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  owaspId: 'LLM01' | 'LLM06' | 'LLM07';
  description: string;
  payload: string;
  breachIndicator: string;
}

export interface TestResult {
  id: string;
  name: string;
  category: AttackCategory;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  owaspId: 'LLM01' | 'LLM06' | 'LLM07';
  description: string;
  payload: string;
  output: string;
  status: 'BREACHED' | 'RESISTED' | 'SUSPICIOUS';
  confidence: number;
  reason: string;
}

export interface BenchmarkReport {
  securityScore: number;
  grade: string;
  stats: {
    total: number;
    breached: number;
    suspicious: number;
    resisted: number;
  };
  results: TestResult[];
}

export interface DefensiveLayer {
  name: string;
  description: string;
  mitigates: string;
}

export interface ShieldPatchResponse {
  shieldedPrompt: string;
  defensiveLayers: DefensiveLayer[];
  improvements: string[];
  estimatedScoreGain: string;
}

export interface FirewallTriggeredRule {
  id: string;
  name: string;
  severity: string;
  match: string;
}

export interface FirewallInspection {
  action: 'BLOCK' | 'FLAG' | 'ALLOW';
  riskScore: number;
  triggeredRules: FirewallTriggeredRule[];
}

export interface SandboxSimResult {
  firewallCheck: FirewallInspection;
  unshielded: {
    output: string;
    error: string | null;
  };
  shielded: {
    output: string;
    error: string | null;
  };
}
