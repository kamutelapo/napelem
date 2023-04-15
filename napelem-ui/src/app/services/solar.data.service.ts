import { Injectable } from '@angular/core';
import { YEARLY_AVG_DATA, YEARLY_AVG } from './solardata';

@Injectable({
    providedIn: 'root'
})
export class SolarDataService {
    private yearlyAvgProductionSeries: any;

    constructor() {
        this.yearlyAvgProductionSeries = this.computeYearlyAvgProductionData()
    }

    private computeYearlyAvgProductionData() {
        const output: any[] = []

        const dkt: any[] = []
        const dnyt: any[] = []

        YEARLY_AVG_DATA.forEach(
            (line) => {
                const date = new Date(line["Dátum"])
                const dkd = line["D-K termelés"]
                const dnyd = line["D-Ny termelés"]

                dkt.push(
                    {
                        "name": date,
                        "value": dkd,
                    }
                )
                dnyt.push(
                    {
                        "name": date,
                        "value": dnyd,
                    }
                )
            }
        );

        output.push( {
            "name": "Dél-Kelet",
            "series": dkt,
        });
        output.push( {
            "name": "Dél-Nyugat",
            "series": dnyt,
        });

        return output;
    }

    getAverageConsumption() : number {
        return YEARLY_AVG;
    }

    getYearlyAverageProductionSeries() {
        return this.yearlyAvgProductionSeries;
    }
}
