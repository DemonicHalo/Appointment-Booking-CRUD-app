import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppointmentList } from './appointment-list/appointment-list';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppointmentList, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('appointment-app');
}
