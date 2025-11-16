export type Database = {
  public: {
    Tables: {
      user_attributes: { Row: { id: string; birth_year: number; retirement_age: number; start_year: number } }
      calculator_stats: { Row: { id: number; calc_count: number; updated_at: string } }
    }
  }
}
