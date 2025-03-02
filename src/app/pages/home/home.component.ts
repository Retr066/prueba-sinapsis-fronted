import { CommonModule, DecimalPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-home',
    imports: [CommonModule, NgbPaginationModule, FormsModule, NgbDatepickerModule],
    providers: [DecimalPipe],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
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
export class HomeComponent {

  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  fromDate: NgbDate = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.fromDate, 'd', 10);
  hoveredDate: NgbDate | null = null;

  countries = [
    {
      id: 1,
      name: 'India',
      area: 1234567890,
      population: 1380004385,
      flag: 'Flag_of_India.png'
    },
    {
      id: 2,
      name: 'United States',
      area: 9833520,
      population: 331002651,
      flag: 'Flag_of_the_United_States.png'
    },
    {
      id: 3,
      name: 'United Kingdom',
      area: 242495,
      population: 67886011,
      flag: 'Flag_of_the_United_Kingdom.png'

    },
    {
      id: 4,
      name: 'Australia',
      area: 7692024,
      population: 25499884,
      flag: 'Flag_of_Australia.png'
    }
  ]

  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: this.countries.length
  }

  refreshCountries() {
    this.countries = this.countries.map((country, i) => {
      const { id, ...rest } = country;
      return { id: i + 1, ...rest };
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
