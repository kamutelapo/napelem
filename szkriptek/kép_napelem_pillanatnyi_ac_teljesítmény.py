#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
from matplotlib import dates as mdates
from scipy import integrate
import napelem_context

BASEDIR=os.path.dirname(__file__) + "/.."

ctx = napelem_context.daily()
df = ctx.getDataframe()

df["AC teljesítmény"] = df["Pac"]

maxy = ctx.roundUp(250, df["AC teljesítmény"])

time_series = df["Time"].diff().dt.total_seconds().fillna(0).cumsum().values

simpson = integrate.simps(df["AC teljesítmény"], time_series) / 3600
dfkwh = int(simpson / 10 + 0.5) / 100

plot = df.plot.area(x='Time', y=['AC teljesítmény'],
          label=['AC teljesítmény (' + str(dfkwh) + ' kWh)'],
          title='Napelem panelek pillanatnyi AC teljesítménye - ' + ctx.date(), color=['orange'],
          ylim = [0, maxy], zorder = 10)
plot.grid(axis = 'y', zorder = -1)
plot.set_xlabel("Idő")

yticks = mtick.FormatStrFormatter('%.0fW')
plot.yaxis.set_major_formatter(yticks)
xticks = mdates.DateFormatter('%H:%M')
plot.xaxis.set_major_formatter(xticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/PillanatnyiACTeljesítmény%s.png"), bbox_inches = "tight")

