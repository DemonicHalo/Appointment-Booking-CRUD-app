import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Appointment } from '../models/appointment';
import { CommonModule } from '@angular/common';

// Bootstrap modal declaration
declare var bootstrap: any;

@Component({
  selector: 'app-appointment-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.css'],
})
export class AppointmentList implements OnInit {
  newAppointmentTitle: string = '';
  newAppointmentDate: string = '';

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  searchTerm: string = '';

  // Edit
  editIndex: number | null = null;
  editTitle: string = '';
  editDate: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 9;
  totalPages: number = 1;

  ngOnInit(): void {
    const savedAppointments = localStorage.getItem('appointments');
    this.appointments = savedAppointments
      ? JSON.parse(savedAppointments).map((a: any) => ({
          ...a,
          date: new Date(a.date),
        }))
      : [];

    this.filteredAppointments = [...this.appointments];
    this.updatePagination();
  }

  // Add Appointment
  addAppointment() {
    if (this.newAppointmentTitle.trim() && this.newAppointmentDate) {
      const newAppointment: Appointment = {
        id: Date.now(),
        title: this.newAppointmentTitle,
        date: new Date(this.newAppointmentDate),
      };

      this.appointments.push(newAppointment);
      this.newAppointmentTitle = '';
      this.newAppointmentDate = '';
      this.saveToLocalStorage();
      this.filterAppointments();
    }
  }

  // Delete Appointment
  deleteAppointment(index: number) {
    const globalIndex = this.appointments.indexOf(
      this.filteredAppointments[index]
    );
    if (globalIndex > -1) this.appointments.splice(globalIndex, 1);
    this.saveToLocalStorage();
    this.filterAppointments();
  }

  // Edit Modal
  openEditModal(index: number) {
    this.editIndex = index;
    this.editTitle = this.filteredAppointments[index].title;
    this.editDate = this.formatDate(this.filteredAppointments[index].date);
  }

  updateAppointment() {
    if (this.editIndex !== null && this.editTitle.trim() && this.editDate) {
      const globalIndex = this.appointments.indexOf(
        this.filteredAppointments[this.editIndex]
      );
      if (globalIndex > -1) {
        this.appointments[globalIndex] = {
          ...this.appointments[globalIndex],
          title: this.editTitle,
          date: new Date(this.editDate),
        };
        this.saveToLocalStorage();
        this.filterAppointments();

        // Close modal programmatically
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
          modal.hide();
        }

        this.editIndex = null;
        this.editTitle = '';
        this.editDate = '';
      }
    }
  }

  // Filter appointments based on search term
  filterAppointments() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredAppointments = this.appointments.filter((a) =>
      a.title.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  // Pagination
  updatePagination() {
    this.totalPages = Math.ceil(
      this.filteredAppointments.length / this.itemsPerPage
    );
    if (this.currentPage > this.totalPages)
      this.currentPage = this.totalPages || 1;
  }

  get paginatedAppointments(): Appointment[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAppointments.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  // Utils
  private saveToLocalStorage() {
    localStorage.setItem('appointments', JSON.stringify(this.appointments));
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
