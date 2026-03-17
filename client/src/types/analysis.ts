export interface FlaggedPhrase {
  phrase: string;
  reason: string;
  tactic:
    | "URGENCY"
    | "OTP_REQUEST"
    | "FAKE_AUTHORITY"
    | "PAYMENT_DEMAND"
    | "THREAT"
    | "IMPERSONATION";
}

export interface AnalysisResult {
  risk_level: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  overall_reason: string;
  flagged_phrases: FlaggedPhrase[];
  language_detected: string;
  transcript?: string;
  // Extended fields (optional — backend may or may not return these)
  confidenceScore?: number;   // 0–100
  tactics?: string[];         // e.g. ["urgency","otp_demand","fake_authority"]
  summary?: string;           // plain-English explanation
  suggestedAction?: string;   // recommended action for user
}

export interface ApiError {
  error: string;
  code:
    | "EMPTY_INPUT"
    | "API_FAILURE"
    | "INVALID_FILE"
    | "RATE_LIMIT"
    | "UNSUPPORTED_FORMAT"
    | "NETWORK_ERROR";
}
