#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
import locale

locale.setlocale(locale.LC_TIME, 'hu_HU.UTF-8')

BASEDIR=os.path.dirname(__file__) + "/.."

df = pd.read_csv(BASEDIR +"/adatok/eon.csv", parse_dates=['Idő', 'Nap'])

df = df.groupby('Nap', as_index=False).mean()

df['Szaldó'] = df['Napi termelés'] - df['Napi fogyasztás']

dfroll = df.rolling(365, center = False, min_periods = 1).sum()
lastvalue = dfroll['Szaldó'].iloc[-1]

if lastvalue < 0:
    lastvalue = int(lastvalue - 0.5)
else:
    lastvalue = int(lastvalue + 0.5)

df['Szaldó'] = dfroll['Szaldó']

mindate = dt.date.today() + pd.DateOffset(days = -365)
df = df[df['Nap'] >= mindate]

plot = df.plot(x='Nap', y=['Szaldó'],
          label=['Szaldó'],
          title='Éves szaldó [' + str(lastvalue) + ' kWh,  ' + str(mindate.date()) + ' - ' + str(dt.date.today()) + ']',
          color=['blue'])
plot.axhline(0,color='magenta',ls='--')

yticks = mtick.FormatStrFormatter('%.0f kWh')
plot.yaxis.set_major_formatter(yticks)
plot.xaxis.label.set_visible(False)
plot.grid(axis='y', zorder = -1, color = 'lightgrey')
plot.grid(axis='x', zorder = -1, color = 'lightgrey')

fig = plot.get_figure()
fig.set_size_inches(8,  5)
fig.savefig(BASEDIR + "/képek/eon/ÉvesSzaldó.png", bbox_inches = "tight")
