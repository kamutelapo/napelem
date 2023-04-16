import { Injectable } from '@angular/core';
import { WEEKLY_AVG_DATA, AVG } from './solardata';

@Injectable({
    providedIn: 'root'
})
export class SolarDataService {
    private weeklyAvgProductionSeries: any;

    constructor() {
        this.weeklyAvgProductionSeries = this.computeWeeklyAvgProductionData()
    }

    private computeWeeklyAvgProductionData() {
        const output: any[] = []

        const dkt: any[] = []
        const dnyt: any[] = []

        WEEKLY_AVG_DATA.forEach(
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
        return AVG;
    }

    getWeeklyAverageProductionSeries() {
        return this.weeklyAvgProductionSeries;
    }
}
