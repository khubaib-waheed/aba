import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-documents',
  imports: [RouterModule, CommonModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {

  identityFile: string | null = null;
  addressFile: string | null = null;

  onFileSelect(event: Event, type: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const fileName = input.files[0].name;
      if (type === 'identity') {
        this.identityFile = fileName;
      } 
      else if((type === 'address')) {
        this.addressFile = fileName;
      }
    }
  }

  removeFile(type: any): void {
    if (type === 'identity') {
      this.identityFile = null;
    } 
    else if((type === 'address')) {
      this.addressFile = null;
    }
  }
}
