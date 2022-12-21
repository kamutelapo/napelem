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

df["Panel teljesítmény"] = df["Vpv1"] * df["Ipv1"] + df["Vpv2"] * df["Ipv2"]
df["AC teljesítmény"] = df["Pac"]

df["Inverter hatékonyság"] = 100 * df["AC teljesítmény"] / df["Panel teljesítmény"]

maxy = ctx.roundUp(10, df["Inverter hatékonyság"])

time_series = df["Time"].diff().dt.total_seconds().fillna(0).cumsum().values

simpson_pv = integrate.simps(df["Panel teljesítmény"], time_series) / 3600
simpson_ac = integrate.simps(df["AC teljesítmény"], time_series) / 3600

dh = int( 10000 *simpson_ac / simpson_pv ) / 100

plot = df.plot(x='Time', y=['Inverter hatékonyság'],
          label=['Inverter hatékonyság (' + str(dh) + '%)'],
          title='Inverter pillanatnyi hatékonysága  -  ' + ctx.date(), color=['mediumorchid'],
          ylim = [0, maxy])
plot.grid(axis='y')
plot.set_xlabel("Idő")

yticks = mtick.FormatStrFormatter('%.0f%%')
plot.yaxis.set_major_formatter(yticks)
xticks = mdates.DateFormatter('%H:%M')
plot.xaxis.set_major_formatter(xticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/PillanatnyiInverterHatékonyság%s.png"), bbox_inches = "tight")
