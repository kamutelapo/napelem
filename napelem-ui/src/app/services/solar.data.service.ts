import { Injectable } from '@angular/core';
import {
    WEEKLY_AVG_DATA, AVG, START_DATE, END_DATE, PRODUCED_ENERGY, AVG_CONSUMPTION, CONSUMPTION,
    MAX_POWER, MAX_POWER_DATE, STRONGEST_DAY, STRONGEST_DAY_DATE, WEAKEST_DAY, WEAKEST_DAY_DATE,
    STRONGEST_WEEK, STRONGEST_WEEK_START, STRONGEST_WEEK_END,
    WEAKEST_WEEK, WEAKEST_WEEK_START, WEAKEST_WEEK_END,
    STRONGEST_MONTH, STRONGEST_MONTH_START, STRONGEST_MONTH_END,
    WEAKEST_MONTH, WEAKEST_MONTH_START, WEAKEST_MONTH_END, WEEKLY_SALDO_AVG, WEEKLY_SALDO_DATA
} from './solardata';

@Injectable({
    providedIn: 'root'
})
export class SolarDataService {
    private weeklyAvgProductionSeries: any;

    private weeklySaldoSeries: any;

    constructor() {
        this.weeklyAvgProductionSeries = this.computeWeeklyAvgProductionData()
        this.weeklySaldoSeries = this.computeWeeklySaldoData()
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

        output.push({
            "name": "Dél-Kelet",
            "series": dkt,
        });
        output.push({
            "name": "Dél-Nyugat",
            "series": dnyt,
        });

        return output;
    }


    private computeWeeklySaldoData() {

        const sld: any[] = []
        const sldavg: any[] = []
        const sldoutput: any[] = []

        WEEKLY_SALDO_DATA.forEach(
            (line) => {
                const date = new Date(line["Dátum"])
                const saldo = line["Szaldó"]

                sld.push(
                    {
                        "name": date,
                        "value": saldo,
                    }
                )

                sldavg.push(
                    {
                        "name": date,
                        "value": WEEKLY_SALDO_AVG,
                    }
                )
            }
        );

        sldoutput.push({
            "name": "Szaldó",
            "series": sld,
        });

        sldoutput.push({
            "name": "Átlag",
            "series": sldavg,
        });

        return sldoutput;
    }


    getAverageProduction(): number {
        return AVG;
    }

    getAverageConsumption(): number {
        return AVG_CONSUMPTION;
    }

    getProducedEnergy(): number {
        return PRODUCED_ENERGY;
    }

    getConsumedEnergy(): number {
        return CONSUMPTION;
    }

    getWeeklyAverageProductionSeries() {
        return this.weeklyAvgProductionSeries;
    }

    getStartDate(): string {
        return START_DATE;
    }

    getEndDate(): string {
        return END_DATE;
    }

    getMaxPower(): number {
        return MAX_POWER;
    }

    getMaxPowerDate(): string {
        return MAX_POWER_DATE;
    }

    getStrongestDay(): number {
        return STRONGEST_DAY;
    }

    getStrongestDayDate(): string {
        return STRONGEST_DAY_DATE;
    }

    getWeakestDay(): number {
        return WEAKEST_DAY;
    }

    getWeakestDayDate(): string {
        return WEAKEST_DAY_DATE;
    }

    getStrongestWeek(): number {
        return STRONGEST_WEEK;
    }

    getStrongestWeekStart(): string {
        return STRONGEST_WEEK_START;
    }

    getStrongestWeekEnd(): string {
        return STRONGEST_WEEK_END;
    }

    getWeakestWeek(): number {
        return WEAKEST_WEEK;
    }

    getWeakestWeekStart(): string {
        return WEAKEST_WEEK_START;
    }

    getWeakestWeekEnd(): string {
        return WEAKEST_WEEK_END;
    }

    getStrongestMonth(): number {
        return STRONGEST_MONTH;
    }

    getStrongestMonthStart(): string {
        return STRONGEST_MONTH_START;
    }

    getStrongestMonthEnd(): string {
        return STRONGEST_MONTH_END;
    }

    getWeakestMonth(): number {
        return WEAKEST_MONTH;
    }

    getWeakestMonthStart(): string {
        return WEAKEST_MONTH_START;
    }

    getWeakestMonthEnd(): string {
        return WEAKEST_MONTH_END;
    }

    getWeeklySaldoSeries() {
        return this.weeklySaldoSeries;
    }

    getWeeklySaldoAvg(): number {
        return WEEKLY_SALDO_AVG;
    }
}
