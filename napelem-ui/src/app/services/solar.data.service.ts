import { Injectable } from '@angular/core';
import {
    WEEKLY_AVG_DATA, AVG, START_DATE, END_DATE, PRODUCED_ENERGY, AVG_CONSUMPTION, CONSUMPTION,
    MAX_POWER, MAX_POWER_DATE, STRONGEST_DAY, STRONGEST_DAY_DATE, WEAKEST_DAY, WEAKEST_DAY_DATE,
    STRONGEST_WEEK, STRONGEST_WEEK_START, STRONGEST_WEEK_END,
    WEAKEST_WEEK, WEAKEST_WEEK_START, WEAKEST_WEEK_END,
    STRONGEST_MONTH, STRONGEST_MONTH_START, STRONGEST_MONTH_END,
    WEAKEST_MONTH, WEAKEST_MONTH_START, WEAKEST_MONTH_END, WEEKLY_SALDO_AVG, WEEKLY_SALDO_DATA, MONTHLY_SALDO_DATA,
    YEARLY_SALDO, DAILY_DATA, MONTHLY_DATA, PRODUCTION_CONSUMPTION_DATA, AVG_WATTS, MAX_VOLTAGE, ACCUMULATOR,
    MONTHLY_AVG_DATA, PRODCON_AVG, MONEY, RAW
} from './solardata';

@Injectable({
    providedIn: 'root'
})
export class SolarDataService {
    private weeklyAvgProductionSeries: any;

    private weeklySaldoSeries: any;

    private monthlySaldoSeries: any;

    private yearlySaldoSeries: any;

    private dailyProductionSeries: any;

    private monthlyProduction: any;

    private monthlyProductionSeries: any;

    private monthlyShortProduction: any;

    private usageSeries: any;

    private totalBackfeed: number | undefined;

    private totalConsumptionFromPV: number | undefined;

    private totalConsumptionFromProvider: number | undefined;

    private avgWatts: any;

    private maxVoltages: any;

    private accumulator: any;

    private monthlyAvgProductionSeries: any;

    private productionConsumptionAvg: any;

    private raw: any;

    private rawIndex: any;

    constructor() {
        this.weeklyAvgProductionSeries = this.computeWeeklyAvgProductionData()
        this.weeklySaldoSeries = this.computeWeeklySaldoData()
        this.monthlySaldoSeries = this.computeMonthlySaldoData()
        this.yearlySaldoSeries = this.computeYearlySaldoData()
        this.dailyProductionSeries = this.computeDailyProductionData()
        this.monthlyProduction = this.computeMonthlyProductionData();
        this.monthlyProductionSeries = this.computeMonthlyProductionSeries();
        this.monthlyShortProduction = this.computeMonthlyShortProductionData();
        this.usageSeries = this.computeUsageData();
        this.avgWatts = this.computeAvgWatts();
        this.maxVoltages = this.computeMaxVoltages();
        this.accumulator = this.computeAccumulator();
        this.monthlyAvgProductionSeries = this.computeMonthlyAvgProductionData()
        this.productionConsumptionAvg = this.computeProductionConsumptionAvg();
        this.raw = this.computeRaw();
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


    private computeMonthlyAvgProductionData() {
        const output: any[] = []

        const dkt: any[] = []
        const dnyt: any[] = []

        MONTHLY_AVG_DATA.forEach(
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


    private computeMonthlySaldoData() {

        const sld: any[] = []
        const sldoutput: any[] = []

        MONTHLY_SALDO_DATA.forEach(
            (line) => {
                const date = new Date(line["Dátum"])
                const saldo = line["Szaldó"]

                sld.push(
                    {
                        "name": date,
                        "value": saldo,
                    }
                )
            }
        );

        sldoutput.push({
            "name": "Szaldó",
            "series": sld,
        });

        return sldoutput;
    }


    private computeYearlySaldoData() {

        const sld: any[] = []
        const sldoutput: any[] = []

        YEARLY_SALDO.forEach(
            (line) => {
                const date = new Date(line["Dátum"])
                const saldo = line["Szaldó"]

                sld.push(
                    {
                        "name": date,
                        "value": saldo,
                    }
                )
            }
        );

        sldoutput.push({
            "name": "Szaldó",
            "series": sld,
        });

        return sldoutput;
    }


    private computeDailyProductionData() {
        const output: any[] = []

        DAILY_DATA.forEach(
            (line) => {
                const date = line["Dátum"]
                const dkd = line["D-K termelés"]
                const dnyd = line["D-Ny termelés"]
                const ossz = Math.floor(100 * (dkd + dnyd) + 0.5) / 100

                output.push({
                    "name": date,
                    "series": [
                        {
                            "name": "Dél-Kelet",
                            "value": dkd,
                            "extra": {
                                "Dél-Kelet": dkd,
                                "Dél-Nyugat": dnyd,
                                "Összes": ossz
                            }
                        },
                        {
                            "name": "Dél-Nyugat",
                            "value": dnyd,
                            "extra": {
                                "Dél-Kelet": dkd,
                                "Dél-Nyugat": dnyd,
                                "Összes": ossz
                            }
                        }
                    ]
                });
            }
        );

        return output;
    }

    private computeMonthlyProductionData() {
        const output: any[] = []

        MONTHLY_DATA.forEach(
            (line) => {
                const month = line["Hónap"]
                const prod = line["Termelés"]
                const ratio = line["Arány"]

                output.push({
                    "name": month,
                    "value": prod,
                    "extra": {
                        "Arány": ratio,
                    }
                });
            }
        );

        return output;
    }

    private computeMonthlyProductionSeries() {
        const output: any[] = []

        MONTHLY_DATA.forEach(
            (line) => {
                const month = line["Hónap"]
                const prod = line["Termelés"]
                const ratio = line["Arány"]

                output.push(
                    {
                        "name": month,
                        "series": [
                            {
                                "name": "Termelés",
                                "value": prod,
                                "extra": {
                                    "Arány": ratio,
                                }
                            }
                        ]
                    }
                )
            }
        );

        return output;
    }

    private computeMonthlyShortProductionData() {
        const output: any[] = []

        MONTHLY_DATA.forEach(
            (line) => {
                const month = line["HónapRövid"]
                const prod = line["Termelés"]
                const ratio = line["Arány"]

                output.push({
                    "name": month,
                    "value": prod,
                    "extra": {
                        "Arány": ratio,
                    }
                });
            }
        );

        return output;
    }

    private computeUsageData() {
        const output: any[] = []

        const dft: any[] = []
        const dnft: any[] = []
        const dvt: any[] = []

        let tbf = 0;
        let tcpv = 0;
        let tcpro = 0;

        PRODUCTION_CONSUMPTION_DATA.forEach(
            (line) => {
                const date = new Date(line["Dátum"])
                const dfd = line["Fogyasztás"]
                const dnfd = line["Napelem fogyasztás"]
                const dvd = line["Visszatáplált"]

                tcpro += dfd;
                tcpv += dnfd;
                tbf += dvd;

                dft.push(
                    {
                        "name": date,
                        "value": -dfd,
                    }
                )
                dnft.push(
                    {
                        "name": date,
                        "value": dnfd,
                    }
                )
                dvt.push(
                    {
                        "name": date,
                        "value": dvd,
                    }
                )
            }
        );

        output.push({
            "name": "Fogyasztás",
            "series": dft,
        });
        output.push({
            "name": "Napelem fogyasztás",
            "series": dnft,
        });
        output.push({
            "name": "Visszatáplált",
            "series": dvt,
        });

        this.totalBackfeed = tbf;
        this.totalConsumptionFromPV = tcpv;
        this.totalConsumptionFromProvider = tcpro;

        return output;
    }

    private computeAvgWatts() {
        const output: any[] = []

        const pw: any[] = []
        const cw: any[] = []

        AVG_WATTS.forEach(
            (line) => {
                const time = line["Óra"]
                const pwd = line["Termelés"]
                const cwd = line["Fogyasztás"]

                pw.push(
                    {
                        "name": time,
                        "value": pwd,
                    }
                )
                cw.push(
                    {
                        "name": time,
                        "value": cwd,
                    }
                )
            }
        );

        output.push({
            "name": "Termelés",
            "series": pw,
        });
        output.push({
            "name": "Fogyasztás",
            "series": cw,
        });

        return output;
    }

    private computeMaxVoltages() {

        const vltmax: any[] = []
        const vltmin: any[] = []
        const vltoutput: any[] = []

        MAX_VOLTAGE.forEach(
            (line) => {
                const time = line["Óra"]
                const voltmax = line["Max. feszültség"]
                const voltmin = line["Min. feszültség"]

                vltmax.push(
                    {
                        "name": time,
                        "value": voltmax,
                    }
                )

                vltmin.push(
                    {
                        "name": time,
                        "value": voltmin,
                    }
                )
            }
        );

        vltoutput.push({
            "name": "Max. feszültség",
            "series": vltmax,
        });

        vltoutput.push({
            "name": "Min. feszültség",
            "series": vltmin,
        });

        return vltoutput;
    }

    private computeAccumulator() {
        const output: any[] = []

        ACCUMULATOR.forEach(
            (line) => {
                const accu = line["Akkumulátor"]
                const ratio = line["Felhasználási arány"]

                output.push({
                    "name": accu,
                    "series": [
                        {
                            "name": "Felhasználási arány",
                            "value": ratio
                        }
                    ]
                });
            }
        );

        return output;
    }

    private computeProductionConsumptionAvg() {
        const prod: any[] = []
        const cons: any[] = []
        const pcavg: any[] = []

        PRODCON_AVG.forEach(
            (line) => {
                const date = new Date(line["Dátum"])
                const prd = line["Termelés"]
                const cns = line["Fogyasztás"]

                prod.push(
                    {
                        "name": date,
                        "value": prd,
                    }
                )

                cons.push(
                    {
                        "name": date,
                        "value": cns,
                    }
                )
            }
        );

        pcavg.push({
            "name": "Termelés",
            "series": prod,
        });

        pcavg.push({
            "name": "Fogyasztás",
            "series": cons,
        });

        return pcavg;
    }

    private computeRaw() {
        const output: any[] = []

        const rf: any[] = []
        const rnf: any[] = []
        const rv: any[] = []

        this.rawIndex = []
        let rndx = 0

        RAW.forEach(
            (line) => {
                const datedy = new Date(line["Dátum"])
                var userTimezoneOffset = datedy.getTimezoneOffset() * 60000

                let ndx = 0
                const ndxmax = line["Fogyasztás"].length
                this.rawIndex.push(rndx);
                rndx += ndxmax
                while(ndx < ndxmax) {
                    const date = new Date(datedy.getTime() + userTimezoneOffset + ndx * (15*60*1000))

                    const rawf = line["Fogyasztás"][ndx]
                    const rawnf= line["Napelem fogyasztás"][ndx]
                    const rawv = line["Visszatáplált"][ndx]

                    ndx+=1

                    rf.push(
                        {
                            "name": date,
                            "value": -rawf,
                        }
                    )
                    rnf.push(
                        {
                            "name": date,
                            "value": rawnf,
                        }
                    )
                    rv.push(
                        {
                            "name": date,
                            "value": rawv,
                        }
                    )
                }
            }
        );

        output.push({
            "name": "Fogyasztás",
            "series": rf,
        });
        output.push({
            "name": "Napelem fogyasztás",
            "series": rnf,
        });
        output.push({
            "name": "Visszatáplált",
            "series": rv,
        });

        this.rawIndex.push(rndx);
        return output
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

    getMonthlyAverageProductionSeries() {
        return this.monthlyAvgProductionSeries;
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

    getMonthlySaldoSeries() {
        return this.monthlySaldoSeries;
    }

    getYearlySaldoSeries() {
        return this.yearlySaldoSeries;
    }

    getDailyProductionSeries() {
        return this.dailyProductionSeries;
    }

    getMonthlyProduction() {
        return this.monthlyProduction;
    }

    getMonthlyProductionSeries() {
        return this.monthlyProductionSeries;
    }

    getMonthlyShortProduction() {
        return this.monthlyShortProduction;
    }

    getUsageSeries() {
        return this.usageSeries;
    }

    getUsageDetails() {
        return [
          {
             "name": "Fogyasztás",
             "value": this.totalConsumptionFromProvider,
          },
          {
            "name": "Napelemből",
            "value": this.totalConsumptionFromPV,
          },
          {
            "name": "Visszatáplált",
            "value": this.totalBackfeed,
          },
        ]
    }

    getAvgWatts() {
        return this.avgWatts;
    }

    getMaxVoltages() {
        return this.maxVoltages;
    }

    getAccumulator() {
        return this.accumulator;
    }

    getProductionConsumption() {
        return this.productionConsumptionAvg;
    }

    getMoney() {
        return MONEY;
    }

    getRaw() {
        return this.raw;
    }

    getRawIndex(): number [] {
        return this.rawIndex;
    }
}
