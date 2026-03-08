export interface Report {
  id: string; // YYYY-MM-DD format
  date: string; // ISO string or formatted string
  content: string;
  createdAt: number; // timestamp
}
