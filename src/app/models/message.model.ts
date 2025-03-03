export interface Message {
    id: number;
    campaign_id: number;
    phone: string;
    text: string;
    shipping_status: number;
    process_date: Date; 
    process_hour: string; // O Date si lo conviertes a formato hora
  }
  