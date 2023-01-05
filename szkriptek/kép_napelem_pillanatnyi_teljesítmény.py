#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
import matplotlib.dates as mdates
from scipy import integrate
import napelem_context

BASEDIR=os.path.dirname(__file__) + "/.."

ctx = napelem_context.daily()
df = ctx.getDataframe()

df["D-K teljesítmény"] = df["Vpv1"] * df["Ipv1"]
df["D-Ny teljesítmény"] = df["Vpv2"] * df["Ipv2"]

maxy = ctx.roundUp(250, df["D-K teljesítmény"], df["D-Ny teljesítmény"])

time_series = df["Time"].diff().dt.total_seconds().fillna(0).cumsum().values

simpson_dny = integrate.simps(df["D-Ny teljesítmény"], time_series) / 3600
simpson_dk = integrate.simps(df["D-K teljesítmény"], time_series) / 3600

dfdnykwh = int(simpson_dny / 10 + 0.5) / 100
dfdkkwh = int(simpson_dk / 10 + 0.5) / 100

plot = df.plot(x='Time', y=['D-K teljesítmény','D-Ny teljesítmény'],
          label=['D-K teljesítmény (10 panel, ' + str(dfdkkwh) + ' kWh)',
                 'D-Ny teljesítmény (6 panel, ' + str(dfdnykwh) + ' kWh)'],
          title='Napelem panelek pillanatnyi teljesítménye  -  ' + ctx.date(), color=['orange','mediumorchid'],
          ylim = [0, maxy], x_compat = True)
plot.grid(axis='y')
plot.set_xlabel("Idő")

yticks = mtick.FormatStrFormatter('%.0fW')
plot.yaxis.set_major_formatter(yticks)
xticks = mdates.DateFormatter('%H:%M')
plot.xaxis.set_major_formatter(xticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/PillanatnyiTeljesítmény%s.png"), bbox_inches = "tight")
