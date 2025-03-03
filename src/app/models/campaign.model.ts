import { User } from "./user.model";

export interface Campaign {
    id: number;
    user: User;
    name: string;
    process_date: string;
    process_hour: string;
    process_status: number;
    phone_list: string;
    message_text: string;
    created_at: string;
    updated_at: string;
  }
