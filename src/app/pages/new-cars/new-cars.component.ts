import { Component } from '@angular/core';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-new-cars',
  imports: [RouterModule, CustomDropdownComponent],
  templateUrl: './new-cars.component.html',
  styleUrl: './new-cars.component.scss'
})
export class NewCarsComponent {

}
