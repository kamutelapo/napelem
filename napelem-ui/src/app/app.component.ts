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
  }

  getSideNavClass() {
    let isMobile = window.innerWidth < 768;
    return isMobile ? "sidenav-mobile" : "sidenav";
  }

  ngOnInit(): void {
    this.onResize();
  }

  onResize() {
    this.hasSideNav = window.innerWidth >= 768;
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
    return window.innerWidth < 768;
  }
}
