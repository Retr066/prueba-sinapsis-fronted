import { Campaign } from "../models/campaign.model";

export interface CreateCampaignDto extends Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'process_status'> {
}
