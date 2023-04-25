import { Component, OnInit } from '@angular/core';
import { timeFormatDefaultLocale, TimeLocaleDefinition } from 'd3-time-format';
import { ViewBoxCalculatorService } from './services/viewbox.calculator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'napelem-ui';

  pageTitle = '';

  hasSideNav = true;

  detailsEnabled = false;

  details: string | undefined = undefined;

  constructor(private viewBoxCalculatorService: ViewBoxCalculatorService) {
    const localeDef: TimeLocaleDefinition = {
      "dateTime": "%Y. %B %-e., %A %X",
      "date": "%Y. %m. %d.",
      "time": "%H:%M:%S",
      "periods": ["de.", "du."],
      "days": ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"],
      "shortDays": ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
      "months": ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
      "shortMonths": ["jan.", "feb.", "márc.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."]
    }

    timeFormatDefaultLocale(localeDef);
    viewBoxCalculatorService.enableSideBar(true);
  }

  onActivate(event:any) {
    this.pageTitle = event.title;
    this.details = event.details;
    this.detailsEnabled = false;
  }

  getSideNavClass() {
    let isMobile = this.viewBoxCalculatorService.isMobile();
    return isMobile ? "sidenav-mobile" : "sidenav";
  }

  ngOnInit(): void {
    this.onResize();
  }

  onResize() {
    this.hasSideNav = !this.viewBoxCalculatorService.isMobile();
    this.viewBoxCalculatorService.enableSideBar(this.hasSideNav);
  }

  enableSideNav() {
    this.viewBoxCalculatorService.enableSideBar(true);
    this.hasSideNav = true;
  }

  disableSideNav() {
    this.viewBoxCalculatorService.enableSideBar(false);
    this.hasSideNav = false;
  }

  restoreSideNav() {
    this.onResize();
  }

  isMobile() {
    return this.viewBoxCalculatorService.isMobile();
  }

  triggerDetails() {
    this.detailsEnabled = !this.detailsEnabled;
  }

  closeDetails() {
    this.detailsEnabled = false;
  }
}
