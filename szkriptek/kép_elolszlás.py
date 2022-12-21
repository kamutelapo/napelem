#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.dates as mdates

BASEDIR=os.path.dirname(__file__) + "/.."

df = pd.read_csv(BASEDIR +"/adatok/eon.csv", parse_dates=['Idő', 'Nap'])
df['Óra'] = df['Idő'].dt.time

df['Óra'] = pd.to_datetime(df["Óra"], format = "%H:%M:%S")

df = df[df['Idő'] >= '2022-06-21 00:00:00']

df = df.groupby('Óra', as_index=False).mean()

plot = df.plot.area(x='Óra', y=['Fogyasztás'],
          label=['Fogyasztás eloszlás [kWh]'],
          title='Fogyasztás eloszlás', color=['green'])
plot.set_ylim(bottom=0)

interval = mdates.HourLocator()
plot.xaxis.set_major_locator(interval)

fig = plot.get_figure()
fig.set_size_inches(10,  5)
fig.savefig(BASEDIR + "/képek/eon/FogyasztásEloszlás.png", bbox_inches = "tight")
