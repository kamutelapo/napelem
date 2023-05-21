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

mindate = dt.date.today() + pd.DateOffset(days = -365)
df = df[df['Nap'] >= mindate]

df = df.groupby('Nap', as_index=False).mean()


plot = df.plot(x='Nap', y=['Napi fogyasztás','Napi termelés'],
          label=['Napi fogyasztás', 'Napi termelés'],
          title='Napi fogyasztás és termelés  -  [' + str(mindate.date()) + ' - ' + str(dt.date.today()) + ']',
          color=['green','blue'])

yticks = mtick.FormatStrFormatter('%.0f kWh')
plot.yaxis.set_major_formatter(yticks)
plot.xaxis.label.set_visible(False)
plot.grid(axis='y', zorder=-1, color="lightgrey")

fig = plot.get_figure()
fig.set_size_inches(8,  5)
fig.savefig(BASEDIR + "/képek/eon/NapiFogyasztásÉsTermelés.png", bbox_inches = "tight")
