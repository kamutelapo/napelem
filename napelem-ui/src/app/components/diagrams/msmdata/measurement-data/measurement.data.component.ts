import { Component } from '@angular/core';
import { SolarDataService } from '../../../../services/solar.data.service';

@Component({
  selector: 'app-measurement-data',
  templateUrl: './measurement.data.component.html',
  styleUrls: ['./measurement.data.component.css']
})
export class MeasurementDataComponent {
  title = "Mérési adatok";

  constructor(public solarDataService: SolarDataService) {

  }

  nonBreakingDate(date: string): string {
    return date.replace(/-/g, "\u2011");
  }

  getInterval() {
    return this.nonBreakingDate(this.solarDataService.getStartDate()) + " - " + this.nonBreakingDate(this.solarDataService.getEndDate());
  }

  nc(inv:number): string {
    return inv.toLocaleString("hu-HU");
  }
}
