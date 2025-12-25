export type Database = {
  public: {
    Tables: {
      user_attributes: { Row: { id: string; birth_year: number; retirement_age: number; start_year: number } }
      calculator_stats: { Row: { id: number; calc_count: number; updated_at: string } }
      partner_links: {Row: {id: string; user_id: string; user_email: string; partner_user_id: string | null; partner_email: string; status: string; permissions: Record<string, string>; invite_token: string; invite_sent_at: string; accepted_at: string | null; revoked_at: string | null; created_at: string; updated_at: string }}
    }
  }
}
