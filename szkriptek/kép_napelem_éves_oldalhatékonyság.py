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

ctx = napelem_context.yearly()
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
df["D-K paneltermelés"] = df["Termelés"] * df['D-K arány'] / 10
df["D-Ny paneltermelés"] = df["Termelés"] * (1 - df['D-K arány']) / 6

df = df[["Date", "D-K paneltermelés", "D-Ny paneltermelés"]]

dfavg = df.rolling(7, center=True).mean()
dfavg["Date"] = df["Date"]
df = dfavg.dropna().reset_index()


df["Összeg"] = df["D-K paneltermelés"] + df["D-Ny paneltermelés"]
df["D-K panelhatékonyság"] = 100 * df["D-K paneltermelés"] / df["Összeg"]
df["D-Ny panelhatékonyság"] = 100 * df["D-Ny paneltermelés"] / df["Összeg"]

dkmean = df["D-K panelhatékonyság"].mean()
dnymean = df["D-Ny panelhatékonyság"].mean()

dkmean = int(100 * dkmean + 0.5) / 100
dnymean = int(100 * dnymean + 0.5) / 100

plot = df.plot.area(x='Date', y=['D-Ny panelhatékonyság', 'D-K panelhatékonyság'], linewidth = 0,
          label=['Dél-Nyugat hatékonyság (' + str(dnymean) + ' %)', 'Dél-Kelet hatékonyság (' + str(dkmean) + ' %)'],
          title='Oldalak összehasonlítása  -  ' + ctx.date(), color=['mediumorchid', 'orange'])
plot.set_xlabel("Dátum")
plot.axhline(50,color='green',ls='--')

yticks = mtick.FormatStrFormatter('%.0f%%')
plot.yaxis.set_major_formatter(yticks)
plot.xaxis.set_tick_params(rotation = 90)

fig = plot.get_figure()
fig.set_size_inches(10, 5)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/ÉvesOldalHatékonyság%s.png"), bbox_inches = "tight")
