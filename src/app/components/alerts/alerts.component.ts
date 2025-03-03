import { Component, Input, SimpleChanges, Type, ViewChild } from '@angular/core';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

type AlertType = 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'secondary' | 'light' | 'dark';

@Component({
  selector: 'app-alerts',
  imports: [
    NgbAlertModule,
  ],
  standalone: true,
  templateUrl: './alerts.component.html',

})
export class AlertsComponent {
  @Input() message: string = '';
  @Type() type: AlertType = 'primary';

  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert!: NgbAlert; 

  private _destroy$ = new Subject<void>(); // Subject para manejar la destrucción del componente

  ngOnChanges(changes: SimpleChanges): void {
    // Si el mensaje cambia y no está vacío, mostramos el alert y lo cerramos después de 5 segundos
    if (changes['message'] && this.message) {
      this.showAlert(this.message, this.type);
    }
  }

  showAlert(message: string, type: AlertType) :void {
    this.message = message;
    this.type = type;

    // Cerramos el alert después de 5 segundos
    setTimeout(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    }, 5000); // 5000 ms = 5 segundos
  }

  ngOnDestroy(): void {
    // Limpiamos el Subject para evitar fugas de memoria
    this._destroy$.next();
    this._destroy$.complete();
  }


}
