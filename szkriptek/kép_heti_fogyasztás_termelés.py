#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os

BASEDIR=os.path.dirname(__file__) + "/.."

df = pd.read_csv(BASEDIR +"/adatok/eon.csv", parse_dates=['Idő', 'Nap'])
df = df.groupby('Nap', as_index=False).mean()

dfroll = df.rolling(7, center=True, min_periods=4).mean()
df['Heti fogyasztás'] = dfroll['Napi fogyasztás']
df['Heti termelés'] = dfroll['Napi termelés']

plot = df.plot(x='Nap', y=['Heti fogyasztás','Heti termelés'],
          label=['Heti fogyasztás [kWh]', 'Heti termelés [kWh]'],
          title='Heti fogyasztás és termelés', color=['green','blue'])

fig = plot.get_figure()
fig.savefig(BASEDIR + "/képek/eon/HetiFogyasztásÉsTermelés.png", bbox_inches = "tight")
