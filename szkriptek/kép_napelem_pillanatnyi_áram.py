#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
from matplotlib import dates as mdates
import napelem_context

BASEDIR=os.path.dirname(__file__) + "/.."

ctx = napelem_context.daily()
df = ctx.getDataframe()

df["D-K áram"] = df["Ipv1"]
df["D-Ny áram"] = df["Ipv2"]

maxy = ctx.roundUp(0.25, df["D-K áram"], df["D-Ny áram"])


plot = df.plot(x='Time', y=['D-K áram','D-Ny áram'],
          title='Napelem panelek pillanatnyi árama  -  ' + ctx.date(), color=['orange','mediumorchid'],
          ylim = [0, maxy])
plot.set_xlabel("Idő")
plot.grid(axis='y')

fmt = '%gA' # Format you want the ticks, e.g. '40%'
yticks = mtick.FormatStrFormatter(fmt)
plot.yaxis.set_major_formatter(yticks)
xticks = mdates.DateFormatter('%H:%M')
plot.xaxis.set_major_formatter(xticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/PillanatnyiÁram%s.png"), bbox_inches = "tight")
