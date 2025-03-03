import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'processStatus',
  pure: true,
  standalone: true,
})
export class ProcessStatusPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    switch(value) {
      case 1: return 'Pendiente';
      case 2: return 'En proceso';
      case 3: return 'Finalizado';
      default: return 'Desconocido';
    }
  }
}
