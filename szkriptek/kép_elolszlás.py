#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.dates as mdates
import matplotlib.ticker as mtick

BASEDIR=os.path.dirname(__file__) + "/.."

df = pd.read_csv(BASEDIR +"/adatok/egyesített.csv", parse_dates=['Idő', 'Nap'])

mindate = dt.date.today() + pd.DateOffset(years = -1)
df = df[df['Nap'] >= mindate]
df = df[df['Nap'] >= '2022-11-12']

df['Fogyasztás'] = df['Fogyasztás'] + df['Napelem fogyasztás']

df['Fogyasztás'] = df['Fogyasztás'] * 4000
df['Napelem termelés'] = df['Napelem termelés'] * 4000

df['Óra'] = df['Idő'].dt.time

df['Óra'] = pd.to_datetime(df["Óra"], format = "%H:%M:%S")

df = df.groupby('Óra', as_index=False).mean()

plot = df.plot.area(x='Óra', y=['Fogyasztás', 'Napelem termelés'],
          label=['Fogyasztás eloszlás', 'Termelés eloszlás'], zorder = 10,
          title='Fogyasztás és termelés eloszlás  -  ['+ str(mindate.date()) + ' - ' + str(dt.date.today()) + ']',
          color=['green', 'blue'], stacked = False)
plot.set_ylim(bottom=0)

yticks = mtick.FormatStrFormatter('%.0fW')
plot.yaxis.set_major_formatter(yticks)

interval = mdates.HourLocator()
plot.xaxis.set_major_locator(interval)
plot.grid(axis='y', zorder = -1, color = 'lightgrey')
plot.grid(axis='x', which='minor', zorder = -1, color = 'lightgrey')

fig = plot.get_figure()
fig.set_size_inches(10,  5)
fig.savefig(BASEDIR + "/képek/eon/FogyasztásÉsTermelésEloszlás.png", bbox_inches = "tight")
