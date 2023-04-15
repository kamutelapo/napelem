import { Component } from '@angular/core';
import { timeFormatDefaultLocale, TimeLocaleDefinition } from 'd3-time-format';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'napelem-ui';

  constructor() {
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
  }
}
