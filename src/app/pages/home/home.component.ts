import { CommonModule, DatePipe, DecimalPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Campaign } from '../../models/campaign.model';
import { CampaignService } from '../../services/campaign.service';
import { ProcessStatusPipe } from '../../pipes/process-status.pipe';
import { CampaignModalFormComponent } from '../../components/campaign-modal-form/campaign-modal-form.component';
import { Subscription } from 'rxjs';
import { AlertsComponent } from "../../components/alerts/alerts.component";


@Component({
  selector: 'app-home',
  imports: [CommonModule, NgbPaginationModule, FormsModule, ProcessStatusPipe, NgbDatepickerModule, AlertsComponent],
  providers: [DecimalPipe, DatePipe],
  templateUrl: './home.component.html',
  styles: `
  		.dp-hidden {
			width: 0;
			margin: 0;
			border: none;
			padding: 0;
		}
		.custom-day {
			text-align: center;
			padding: 0.185rem 0.25rem;
			display: inline-block;
			height: 2rem;
			width: 2rem;
		}
		.custom-day.focused {
			background-color: #e6e6e6;
		}
		.custom-day.range,
		.custom-day:hover {
			background-color: rgb(2, 117, 216);
			color: white;
		}
		.custom-day.faded {
			background-color: rgba(2, 117, 216, 0.5);
		}
  `
})
export class HomeComponent implements OnInit {

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10);
  hoveredDate: NgbDate | null = null;

  campaigns: Campaign[] = []
  campaignCreatedSubscription: Subscription | undefined;

  @ViewChild('alerts') alerts!: AlertsComponent; 

  constructor(
    private readonly campaignService: CampaignService,
    private readonly modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.loadCampaigns();
  }

 

  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 20
  }

  openCreateCampaignModal(): void {
    const modalRef = this.modalService.open(CampaignModalFormComponent);

    if (this.campaignCreatedSubscription) {
      this.campaignCreatedSubscription.unsubscribe();
    }
  

    this.campaignCreatedSubscription = modalRef.componentInstance.campaignCreated.subscribe((campaign: Campaign) => {
      this.campaignService.createCampaign(campaign).subscribe(
        {
          next: (createdCampaign) => {
            // llamar el componente de alertas
            this.alerts.showAlert(createdCampaign.message, 'success');
          },
          error: (error) => {
            console.log('Error', error);
            this.alerts.showAlert(error.error.error, 'danger');
          },
          complete: () => {
            this.loadCampaigns();
          }
        }
      );
    });
  }


  loadCampaigns() {
    this.campaignService.getCampaigns().subscribe({
      next: (campaigns) => {
        console.log('Campaigns', campaigns);
        this.campaigns = campaigns;
      },
      error: (error) => {
        this.alerts.showAlert(error.error.message, 'danger');
      },
      complete: () => {
        console.log('Completed');
      }
    });
  }

  searchCampaigns() {
    this.campaignService.getCampaigns(this.formatter.format(this.fromDate), this.formatter.format(this.toDate)).subscribe({
      next: (campaigns) => {
        this.campaigns = campaigns;
      },
      error: (error) => {
        this.alerts.showAlert(error.error.message, 'danger');
      },
      complete: () => {
        console.log('Completed');
      }
    });
  }

  simulateCampaign(id: number) {
    this.campaignService.simulateCampaign(id).subscribe({
      next: (response) => {
        this.alerts.showAlert(response.message, 'success');
      },
      error: (error) => {
        this.alerts.showAlert(error.error.message, 'danger');
      },
      complete: () => {
        console.log('Completed');
      }
    });
  }


  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


}
