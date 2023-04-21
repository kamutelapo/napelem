#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
from matplotlib import dates as mdates
from matplotlib.offsetbox import AnchoredText
from scipy import integrate
import napelem_context
import matplotlib as mpl

mpl.rcParams["legend.framealpha"] = 1

BASEDIR=os.path.dirname(__file__) + "/.."

ctx = napelem_context.yearly()
df = ctx.getDataframe()
dfj = ctx.getJoinedDataframe()

df['Dátum'] = df['Time'].dt.date

mintime = df['Time'].min()

dfj = dfj[dfj["Idő"] >= mintime]

firstdfj = dfj.iloc[0]
lastdfj = dfj.iloc[-1]

consumption = lastdfj["Összes fogyasztás"] - firstdfj["Összes fogyasztás"]
consumption += lastdfj["Összes napelem fogyasztás"] - firstdfj["Összes napelem fogyasztás"]

consumption = int(consumption * 100 + 0.5) / 100

pacmaxidx = df['Pac'].idxmax()
powermaxdate = df.loc[pacmaxidx]['Dátum']
powermaxvalue = int(df.loc[pacmaxidx]['Pac'])

total_energy = (df["E-Total"]).max()

mindate = df['Dátum'].min()
maxdate = df['Dátum'].max()

df["D-K"] = (df["Vpv1"] * df["Ipv1"]).cumsum() * 300 / 3600
df["D-Ny"] = (df["Vpv2"] * df["Ipv2"]).cumsum()  * 300 / 3600

dffirst = df.groupby("Dátum").first()
dffirst = dffirst[['E-Total', 'D-K', 'D-Ny']].reset_index() \
    .rename(columns = {'E-Total': 'Termelés kezdet', 'D-K': 'D-K kezdet', 'D-Ny': 'D-Ny kezdet'})
dflast = df.groupby("Dátum").last()
dflast = dflast[['E-Total', 'D-K', 'D-Ny']].reset_index() \
    .rename(columns = {'E-Total': 'Termelés vég', 'D-K': 'D-K vég', 'D-Ny': 'D-Ny vég'})

df = pd.merge(dffirst, dflast, left_on = 'Dátum', right_on = 'Dátum')


df["Termelés"] = df['Termelés vég'] - df['Termelés kezdet']
df['D-K'] = df['D-K vég'] - df['D-K kezdet']
df['D-Ny'] = df['D-Ny vég'] - df['D-Ny kezdet']
df['D-K arány'] = df['D-K'] / (df['D-K'] + df['D-Ny'])
df["D-K termelés"] = df["Termelés"] * df['D-K arány']
df["D-Ny termelés"] = df["Termelés"] * (1 - df['D-K arány'])

dfdl = df[["Dátum", "D-K termelés", "D-Ny termelés"]].copy()
dfdl["Dátum"] = dfdl["Dátum"].astype(str)

dminidx = df['Termelés'].idxmin()
dmaxidx = df['Termelés'].idxmax()

dmindate = df.loc[dminidx]['Dátum']
dmin = df.loc[dminidx]['Termelés']

dmaxdate = df.loc[dmaxidx]['Dátum']
dmax = df.loc[dmaxidx]['Termelés']

ossz = df["Termelés"].sum()
numdays = (df["Dátum"].max() - df["Dátum"].min()).days + 1
avg = ossz / numdays

avg_consumption = consumption / numdays

df = df[["Dátum", "D-K termelés", "D-Ny termelés", "Termelés"]]

dfavg = df.rolling(7, center=True).mean()
dfavg["Dátum"] = df["Dátum"]

dfhavi=df.copy()
dfhavi = dfhavi.rolling(30, center=True).mean().dropna()

hminidx = dfhavi["Termelés"].idxmin()
hmaxidx = dfhavi["Termelés"].idxmax()

hmin = dfhavi.loc[hminidx]["Termelés"]
hmax = dfhavi.loc[hmaxidx]["Termelés"]

hmindate = df.loc[hminidx]['Dátum']
hminstart = hmindate + dt.timedelta(days = -15)
hminend = hmindate + dt.timedelta(days = 14)

hmaxdate = df.loc[hmaxidx]['Dátum']
hmaxstart = hmaxdate + dt.timedelta(days = -15)
hmaxend = hmaxdate + dt.timedelta(days = 14)

df = dfavg.dropna().copy()


minavgidx = df["Termelés"].idxmin()
maxavgidx = df["Termelés"].idxmax()

minavg = df.loc[minavgidx]["Termelés"]
maxavg = df.loc[maxavgidx]["Termelés"]

minavgdate = df.loc[minavgidx]['Dátum']
minavgstart = minavgdate + dt.timedelta(days = -3)
minavgend = minavgdate + dt.timedelta(days = 3)

maxavgdate = df.loc[maxavgidx]['Dátum']
maxavgstart = maxavgdate + dt.timedelta(days = -3)
maxavgend = maxavgdate + dt.timedelta(days = 3)

del df["Termelés"]

df["Dátum"] = df["Dátum"].astype(str)

dfjc = dfj.copy()

dfjc = dfjc.groupby('Nap', as_index=False).mean()

dfjc['Szaldó'] = dfjc['Napi termelés'] - dfjc['Napi fogyasztás']

saldo_avg = dfjc['Szaldó'].mean()

dfroll = dfjc.rolling(7, center = False).mean()
dfjc['Szaldó'] = dfroll['Szaldó']

dfjc = dfjc[['Nap', 'Szaldó']].dropna()
dfjc["Dátum"] = dfjc["Nap"].astype(str)
del dfjc['Nap']


output = "export const WEEKLY_AVG_DATA = " + df.to_json(orient='records', force_ascii=False, double_precision = 2).replace("},", "},\n  ").replace("}]", "}\n];\n\n")
output += "export const AVG = " + str(int(float(avg) * 100 + 0.5) / 100) + ";\n\n"

output += "export const START_DATE = \"" + str(mindate) + "\";\n\n"

output += "export const END_DATE = \"" + str(maxdate) + "\";\n\n"

output += "export const PRODUCED_ENERGY = " + str(total_energy) + ";\n\n"

output += "export const CONSUMPTION = " + str(consumption) + ";\n\n"

output += "export const AVG_CONSUMPTION = " + str(int(float(avg_consumption) * 100 + 0.5) / 100) + ";\n\n"

output += "export const MAX_POWER = " + str(powermaxvalue) + ";\n\n"

output += "export const MAX_POWER_DATE = \"" + str(powermaxdate) + "\";\n\n"

output += "export const STRONGEST_DAY = " + str(int(float(dmax) * 100 + 0.5) / 100) + ";\n\n"

output += "export const STRONGEST_DAY_DATE = \"" + str(dmaxdate) + "\";\n\n"

output += "export const WEAKEST_DAY = " + str(int(float(dmin) * 100 + 0.5) / 100) + ";\n\n"

output += "export const WEAKEST_DAY_DATE = \"" + str(dmindate) + "\";\n\n"

output += "export const STRONGEST_WEEK = " + str(int(float(maxavg) * 100 + 0.5) / 100) + ";\n\n"

output += "export const STRONGEST_WEEK_START = \"" + str(maxavgstart) + "\";\n\n"

output += "export const STRONGEST_WEEK_END = \"" + str(maxavgend) + "\";\n\n"

output += "export const WEAKEST_WEEK = " + str(int(float(minavg) * 100 + 0.5) / 100) + ";\n\n"

output += "export const WEAKEST_WEEK_START = \"" + str(minavgstart) + "\";\n\n"

output += "export const WEAKEST_WEEK_END = \"" + str(minavgend) + "\";\n\n"

output += "export const STRONGEST_MONTH = " + str(int(float(hmax) * 100 + 0.5) / 100) + ";\n\n"

output += "export const STRONGEST_MONTH_START = \"" + str(hmaxstart) + "\";\n\n"

output += "export const STRONGEST_MONTH_END = \"" + str(hmaxend) + "\";\n\n"

output += "export const WEAKEST_MONTH = " + str(int(float(hmin) * 100 + 0.5) / 100) + ";\n\n"

output += "export const WEAKEST_MONTH_START = \"" + str(hminstart) + "\";\n\n"

output += "export const WEAKEST_MONTH_END = \"" + str(hminend) + "\";\n\n"

output += "export const WEEKLY_SALDO_DATA = " + dfjc.to_json(orient='records', force_ascii=False, double_precision = 2).replace("},", "},\n  ").replace("}]", "}\n];\n\n")

output += "export const WEEKLY_SALDO_AVG = " + str(int(float(saldo_avg) * 100 + 0.5) / 100) + ";\n\n"

output += "export const DAILY_DATA = " + dfdl.to_json(orient='records', force_ascii=False, double_precision = 2).replace("},", "},\n  ").replace("}]", "}\n];\n\n")

#print (output)

f = open(BASEDIR + "/napelem-ui/src/app/services/solardata.ts", "w")
f.write(output)
f.close()
