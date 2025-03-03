import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Campaign } from '../../models/campaign.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
import { FormBuilder, FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// import { phoneTextValidator } from '../../validators/phone-text.directive';
import { CommonModule } from '@angular/common';
import { PhoneTextValidator } from '../../validators/phone-text.directive';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

export interface FormModel {
  name: FormControl<string>;
  user_id: FormControl<string>;
  process_date: FormControl<string>;
  process_hour: FormControl<string>;
  phone_list: FormControl<string>;
  message_text: FormControl<string>;
}

@Component({
  selector: 'app-campaign-modal-form',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './campaign-modal-form.component.html',

})
export class CampaignModalFormComponent implements OnInit {

  fb = inject(NonNullableFormBuilder);
  phoneTextValidator = inject(PhoneTextValidator);
  activeModal = inject(NgbActiveModal);
  userService = inject(UserService);

  users:User[] = [];

  campaignForm : FormGroup<FormModel> = this.fb.group({
    name: this.fb.control('', {validators: [Validators.required, Validators.minLength(3)]}),
    user_id: ['', Validators.required],
    process_date: [new Date().toISOString().split('T')[0], Validators.required],
    process_hour: ['', Validators.required],
    phone_list: this.fb.control('', {validators: [Validators.required],asyncValidators: [this.phoneTextValidator.validate] ,updateOn: 'blur'}),
    message_text: ['', Validators.required],
  });

  control = this.campaignForm.controls;

  @Output() campaignCreated = new EventEmitter<CreateCampaignDto>();

  ngOnInit(): void {
      this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUser().subscribe(
      {
        next: (users) => {
          this.users = users;
          console.log('users', users);
        },
        error: (error) => {
          console.error('error', error.error.message);
        },
        complete: () => {
          console.log('complete');
        }
      }
    )
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }
    this.campaignCreated.emit({
      ...this.campaignForm.value,
    } as CreateCampaignDto);
    this.activeModal.close(); // Cerrar el modal
    // limpiar el formulario y errores
    this.campaignForm.reset();
    
  }



}
