import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Campaign } from '../models/campaign.model';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
@Injectable({
  providedIn: 'root'
  
})
export class CampaignService {
  constructor(
    private readonly http: HttpClient
  ) { }

  getCampaigns(
    startDate?: string,
    endDate?: string,
  ) : Observable<Campaign[]> {

    return this.http.get<{data: Campaign[]}>(environment.apiUrl + 'campaigns', {
      params: {
        startDate: startDate || '',
        endDate: endDate || ''
      }
    }).pipe(
      map(response => response.data)
    );
  }

  getCampaign(id: number) : Observable<Campaign> {
    return this.http.get<Campaign>(environment.apiUrl + 'campaigns/' + id);
  }

  createCampaign(campaign: CreateCampaignDto) : Observable<{message:string}> {
    return this.http.post<{message:string}>(environment.apiUrl + 'campaigns', campaign);
  }

  simulateCampaign(id: number) : Observable<{message:string}> {
    return this.http.get<{message:string}>(environment.apiUrl + 'campaigns/' + id + '/send');
  }

}
