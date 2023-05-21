#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
from os.path import exists

remnant = 0

def fixTimeSync(pvProd, eonProd):
    global remnant
    pvdt = pvProd
    if eonProd > pvProd:
        remnant += eonProd - pvProd
        pvdt = eonProd
    elif (pvProd > eonProd) and (remnant > 0):
        diff = pvProd - eonProd
        if diff > remnant:
            diff = remnant
        remnant -= diff
        pvdt -= diff
        
    return pvdt

BASEDIR=os.path.dirname(__file__) + "/../adatok"

dfinverter = pd.read_csv(BASEDIR + "/inverter.csv", parse_dates=['Time'], usecols = ['Time', 'Pac', 'E-Total'])

dfinverter["RTime"] = dfinverter["Time"].dt.round("5min")
del dfinverter["Time"]

dfinverter = dfinverter.rename(columns = {'RTime': 'Time'}, inplace = False)

dfinverter['Nap'] = dfinverter.apply(lambda row: row['Time'].date(), axis=1)

difftime = dfinverter["Time"].diff().dt.total_seconds().fillna(0).iloc[1:]
dfinverter["Diff"] = difftime

nextdf = dfinverter.iloc[1:][['Pac', 'Diff']]
dummy = pd.DataFrame([[0], [1]]);
nextdf = pd.concat([nextdf, dummy], ignore_index=True)

dfinverter['Next Pac'] = nextdf['Pac'].fillna(0)
dfinverter['Diff'] = nextdf['Diff']

dfinverter['Avg Pac'] = (dfinverter['Pac'] + dfinverter['Next Pac']) / 2
dfinverter['Calculated kWh'] = (dfinverter['Avg Pac'] * dfinverter['Diff'] / 3600000).fillna(0)

dfisum = dfinverter[['Nap', 'Calculated kWh']].groupby("Nap").sum()
gby = dfinverter[['Nap', 'E-Total']].groupby("Nap")
dfitotl = gby.last() - gby.first()
# prevent overflow
dfitotl['E-Total'].replace(to_replace = 0, value = 0.00001, inplace=True)

dficomm = pd.merge(dfisum, dfitotl, left_on = 'Nap', right_on = 'Nap')

dficomm['Multiplier'] = dficomm['E-Total'] / dficomm['Calculated kWh']
dficomm = dficomm.reset_index()[['Nap', 'Multiplier']]

dfinverter = pd.merge(dfinverter, dficomm, left_on = 'Nap', right_on = 'Nap')

dfinverter['Calculated kWh'] = dfinverter['Calculated kWh'] * dfinverter['Multiplier']
del dfinverter['Multiplier']

dfinverter['Total Energy'] = dfinverter['Calculated kWh'].cumsum()

dfinverter.set_index("Time", inplace = True)

dfinverter = dfinverter[['Total Energy']]

dfinverter = dfinverter.resample('15min').last().interpolate('linear')
index = dfinverter.index


dfinverter.index.name = "Idő"

dfinverter = dfinverter.reset_index()

prevdf = dfinverter.iloc[:-1][['Total Energy']]
dummy = pd.DataFrame([[0] * 1]);
prevdf = pd.concat([dummy, prevdf], ignore_index=True)

dfinverter["Prev Total Energy"] = prevdf['Total Energy'].fillna(0)

dfinverter["Napelem termelés"] = dfinverter["Total Energy"] - dfinverter["Prev Total Energy"]

dfinverter = dfinverter[["Idő", "Napelem termelés"]]


df = pd.read_csv(BASEDIR + "/eon.csv", parse_dates=['Idő'])

df = pd.merge(df, dfinverter, left_on = 'Idő', right_on = 'Idő', how="left")

df["Napelem termelés"] = df["Napelem termelés"].fillna(0)

df['Fixed napelem termelés'] = df.apply(lambda row: fixTimeSync(row['Napelem termelés'], row['Termelés']), axis=1)
del df['Napelem termelés']
df = df.rename(columns = {'Fixed napelem termelés': 'Napelem termelés'}, inplace = False)

df["Összes napelem termelés"] = df["Napelem termelés"].cumsum()

df["Napelem fogyasztás"] = df["Napelem termelés"] - df["Termelés"]


df["Összes napelem fogyasztás"] = df["Napelem fogyasztás"].cumsum()

df["Nettó termelés"] = (df["Termelés"] - df["Fogyasztás"]).clip(lower = 0)
df["Nettó fogyasztás"] = (df["Fogyasztás"] - df["Termelés"] + df["Nettó termelés"])
df["Nettó napelem fogyasztás"] = df["Napelem termelés"] - df["Nettó termelés"]

df["Összes nettó fogyasztás"] = df["Nettó fogyasztás"].cumsum()
df["Összes nettó termelés"] = df["Nettó termelés"].cumsum()
df["Összes nettó napelem fogyasztás"] = df["Nettó napelem fogyasztás"].cumsum()


roundit = [
    "Napelem termelés", "Napelem fogyasztás", "Összes napelem fogyasztás", "Nettó termelés", "Nettó fogyasztás",
    "Nettó napelem fogyasztás", "Összes nettó fogyasztás", "Összes nettó termelés", "Összes nettó napelem fogyasztás",
    "Fogyasztás","Termelés","Energia egyenleg","Összes fogyasztás","Összes termelés","Napi fogyasztás","Napi termelés",
    "Összes napelem termelés"
]

for i in roundit:
    df[i] = df[i].astype(float).round(3)

df.to_csv(BASEDIR + "/egyesített.csv", index = False)
