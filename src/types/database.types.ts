export type Database = {
  public: {
    Tables: {
      user_attributes: { Row: { id: string; birth_year: number; retirement_age: number; start_year: number } }
    }
  }
}
