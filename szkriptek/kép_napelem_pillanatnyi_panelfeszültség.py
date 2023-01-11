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

df["D-K panelfeszültség"] = df["Vpv1"] / 10
df["D-Ny panelfeszültség"] = df["Vpv2"] / 6

maxy = ctx.roundUp(10, df["D-K panelfeszültség"], df["D-Ny panelfeszültség"])

plot = df.plot(x='Time', y=['D-K panelfeszültség','D-Ny panelfeszültség'],
          title='Napelem panelek pillanatnyi feszültsége  -  ' + ctx.date(), color=['orange','mediumorchid'],
          ylim = [0, maxy], x_compat = True)
plot.grid(axis='y')
plot.set_xlabel("Idő")

fmt = '%gV' # Format you want the ticks, e.g. '40%'
yticks = mtick.FormatStrFormatter(fmt)
plot.yaxis.set_major_formatter(yticks)
xticks = mdates.DateFormatter('%H:%M')
plot.xaxis.set_major_formatter(xticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/PillanatnyiPanelfeszültség%s.png"), bbox_inches = "tight")
