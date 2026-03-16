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