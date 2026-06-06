export type Database = {
  public: {
    Tables: {
      calculator_stats: { Row: { id: number; calc_count: number; updated_at: string } }
    }
  }
}
