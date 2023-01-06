#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
from os.path import exists

BASEDIR=os.path.dirname(__file__) + "/../adatok"

dfinverter = pd.read_csv(BASEDIR + "/inverter.csv", parse_dates=['Time'], usecols = ['Time', 'Pac'])

difftime = dfinverter["Time"].diff().dt.total_seconds().fillna(0).iloc[1:]
dfinverter["Diff"] = difftime

nextdf = dfinverter.iloc[1:][['Pac', 'Diff']]
dummy = pd.DataFrame([[0], [1]]);
nextdf = pd.concat([nextdf, dummy], ignore_index=True)

dfinverter['Next Pac'] = nextdf['Pac'].fillna(0)
dfinverter['Diff'] = nextdf['Diff']

dfinverter['Avg Pac'] = (dfinverter['Pac'] + dfinverter['Next Pac']) / 2
dfinverter['Calculated kWh'] = (dfinverter['Avg Pac'] * dfinverter['Diff'] / 3600000).fillna(0)
dfinverter['Total Energy'] = dfinverter['Calculated kWh'].cumsum()

dfinverter.set_index("Time", inplace = True)
index = dfinverter.index

kezdet = index.min()
new_min = int(kezdet.minute / 15) * 15
kezdet = kezdet.replace(minute = new_min, second = 0)
kezdet = kezdet + dt.timedelta(minutes = 15)

r = pd.date_range(kezdet, index.max(), freq='15min')

dfinverter = dfinverter.reindex(index.union(r)).interpolate('index').loc[r]
dfinverter.index.name = "Idő"

dfinverter = dfinverter.reset_index()

prevdf = dfinverter.iloc[:-1][['Total Energy']]
dummy = pd.DataFrame([[0] * 6]);
prevdf = pd.concat([dummy, prevdf], ignore_index=True)

dfinverter["Prev Total Energy"] = prevdf['Total Energy'].fillna(0)

dfinverter["Napelem termelés"] = dfinverter["Total Energy"] - dfinverter["Prev Total Energy"]

dfinverter = dfinverter[["Idő", "Napelem termelés"]]

df = pd.read_csv(BASEDIR + "/eon.csv", parse_dates=['Idő'])

df = pd.merge(df, dfinverter, left_on = 'Idő', right_on = 'Idő', how="left")
df["Napelem termelés"] = df["Napelem termelés"].fillna(0)

df["Napelem fogyasztás"] = (df["Napelem termelés"] - df["Termelés"]).clip(lower = 0)
df["Összes napelem fogyasztás"] = df["Napelem fogyasztás"].cumsum()

df["Nettó termelés"] = (df["Termelés"] - df["Fogyasztás"]).clip(lower = 0)
df["Nettó fogyasztás"] = df["Fogyasztás"] - df["Termelés"] + df["Nettó termelés"]

df["Összes nettó fogyasztás"] = df["Nettó fogyasztás"].cumsum()
df["Összes nettó termelés"] = df["Nettó termelés"].cumsum()

df.to_csv(BASEDIR + "/egyesített.csv", index = False)
