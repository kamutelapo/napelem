#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
import matplotlib.dates as mdates
import napelem_context

BASEDIR=os.path.dirname(__file__) + "/.."

ctx = napelem_context.daily()
df = ctx.getDataframe()

mpp1_pmax = 405 * 10
mpp2_pmax = 405 * 6

df["D-K teljesítmény"] = df["Vpv1"] * df["Ipv1"]
df["D-Ny teljesítmény"] = df["Vpv2"] * df["Ipv2"]
df["D-K hatékonyság"] = 100 * df["D-K teljesítmény"] / mpp1_pmax
df["D-Ny hatékonyság"] = 100 * df["D-Ny teljesítmény"] / mpp2_pmax

maxy = ctx.roundUp(10, df["D-K hatékonyság"], df["D-Ny hatékonyság"])


plot = df.plot(x='Time', y=['D-K hatékonyság','D-Ny hatékonyság'],
          title='Napelem panelek pillanatnyi hatékonysága  -  ' + ctx.date(), color=['orange','mediumorchid'],
          ylim = [0, maxy], x_compat = True)
plot.set_xlabel("Idő")
plot.grid(axis='y')

fmt = '%.0f%%' # Format you want the ticks, e.g. '40%'
yticks = mtick.FormatStrFormatter(fmt)
plot.yaxis.set_major_formatter(yticks)
xticks = mdates.DateFormatter('%H:%M')
plot.xaxis.set_major_formatter(xticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/PillanatnyiNapelemHatékonyság%s.png"), bbox_inches = "tight")
