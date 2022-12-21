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

ctx = napelem_context.monthly()
df = ctx.getDataframe()

df['Date'] = df['Time'].dt.date

df["D-K"] = (df["Vpv1"] * df["Ipv1"]).cumsum() * 300 / 3600
df["D-Ny"] = (df["Vpv2"] * df["Ipv2"]).cumsum()  * 300 / 3600


dffirst = df.groupby("Date").first()
dffirst = dffirst[['E-Total', 'D-K', 'D-Ny']].reset_index() \
    .rename(columns = {'E-Total': 'Termelés kezdet', 'D-K': 'D-K kezdet', 'D-Ny': 'D-Ny kezdet'})
dflast = df.groupby("Date").last()
dflast = dflast[['E-Total', 'D-K', 'D-Ny']].reset_index() \
    .rename(columns = {'E-Total': 'Termelés vég', 'D-K': 'D-K vég', 'D-Ny': 'D-Ny vég'})

df = pd.merge(dffirst, dflast, left_on = 'Date', right_on = 'Date')

df["Termelés"] = df['Termelés vég'] - df['Termelés kezdet']
df['D-K'] = df['D-K vég'] - df['D-K kezdet']
df['D-Ny'] = df['D-Ny vég'] - df['D-Ny kezdet']
df['D-K arány'] = df['D-K'] / (df['D-K'] + df['D-Ny'])
df["D-K termelés"] = df["Termelés"] * df['D-K arány']
df["D-Ny termelés"] = df["Termelés"] * (1 - df['D-K arány'])

ossz = df.sum()["Termelés"]
dksum = int(100 * df.sum()["D-K termelés"] + 0.5) / 100
dnysum = int(100 * df.sum()["D-Ny termelés"] + 0.5) / 100

numdays = (df["Date"].max() - df["Date"].min()).days + 1
avg = ossz / numdays

avgstr = str(int(100 * avg + 0.5) / 100)

maxy = ctx.roundUp(1, (df["D-K termelés"] + df["D-Ny termelés"]).max()) * 1.15

plot = df.plot(x='Date', y=['D-Ny termelés', 'D-K termelés'],
               label=['D-Ny termelés [6 panel, ' + napelem_context.pretty(dnysum) + ' kWh]', 'D-K termelés [10 panel, ' + napelem_context.pretty(dksum) + ' kWh]'],
               title='Havi termelés [' + napelem_context.pretty(ossz) + ' kWh, ' + avgstr + ' kWh naponta]  -  ' + ctx.date(),
               color=['mediumorchid', 'orange'], kind='bar', zorder = 10, stacked=True, ylim=[0, maxy])
plot.set_xlabel("Dátum")
plot.grid(axis='y', zorder = -1)
plot.axhline(avg,color='green',ls='--')

yticks = mtick.FormatStrFormatter('%.0f kWh')
plot.yaxis.set_major_formatter(yticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/HaviTermelés%s.png"), bbox_inches = "tight")
