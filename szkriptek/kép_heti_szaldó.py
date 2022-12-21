#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os

BASEDIR=os.path.dirname(__file__) + "/.."

df = pd.read_csv(BASEDIR +"/adatok/eon.csv", parse_dates=['Idő', 'Nap'])

df = df.groupby('Nap', as_index=False).mean()

df['Szaldó'] = df['Napi termelés'] - df['Napi fogyasztás']

dfroll = df.rolling(7, center = False, min_periods = 1).sum()

df['Szaldó'] = dfroll['Szaldó']

mindate = dt.date.today() + pd.DateOffset(days = -365)
df = df[df['Nap'] >= mindate]

plot = df.plot(x='Nap', y=['Szaldó'],
          label=['Heti szaldó [kWh]'],
          title='Heti szaldó', color=['blue'])
plot.axhline(0,color='magenta',ls='--')

fig = plot.get_figure()
fig.savefig(BASEDIR + "/képek/eon/HetiSzaldó.png", bbox_inches = "tight")
