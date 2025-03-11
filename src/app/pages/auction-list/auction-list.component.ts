import { Component } from '@angular/core';
import { CustomDropdownComponent } from '../../shared/custom-dropdown/custom-dropdown.component';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-auction-list',
  imports: [RouterModule, CustomDropdownComponent],
  templateUrl: './auction-list.component.html',
  styleUrl: './auction-list.component.scss'
})
export class AuctionListComponent {

  constructor() {}

}
