#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os

BASEDIR=os.path.dirname(__file__) + "/.."

df = pd.read_csv(BASEDIR +"/adatok/eon.csv", parse_dates=['Idő', 'Nap'])

df = df.groupby('Nap', as_index=False).mean()


plot = df.plot(x='Nap', y=['Napi fogyasztás','Napi termelés'],
          label=['Napi fogyasztás [kWh]', 'Napi termelés [kWh]'],
          title='Napi fogyasztás és termelés', color=['green','blue'])

fig = plot.get_figure()
fig.savefig(BASEDIR + "/képek/eon/NapiFogyasztásÉsTermelés.png", bbox_inches = "tight")
