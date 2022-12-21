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
df["D-K termelés"] = df["Termelés"] * df['D-K arány']
df["D-Ny termelés"] = df["Termelés"] * (1 - df['D-K arány'])

ossz = df.sum()["Termelés"]
dksum = int(100 * df.sum()["D-K termelés"] + 0.5) / 100
dnysum = int(100 * df.sum()["D-Ny termelés"] + 0.5) / 100

numdays = (df["Date"].max() - df["Date"].min()).days + 1
avg = ossz / numdays
avg = int(avg * 100 + 0.5) / 100

df = df[["Date", "D-K termelés", "D-Ny termelés"]]

dfavg = df.rolling(7, center=True).mean()
dfavg["Date"] = df["Date"]

dfavg2=df.copy()
dfavg2["Átlag"] = df["D-K termelés"]+df["D-Ny termelés"]
dfavg2 = dfavg2.rolling(30, center=True, min_periods=0).mean()

dfavg["Átlag"] = dfavg2["Átlag"]
dfavg["TeljesÁtlag"] = 0*dfavg2["Átlag"] + avg

df = dfavg.dropna()


plot = df.plot.area(x='Date', y=['D-Ny termelés', 'D-K termelés'], linewidth = 0,
          label=['Dél-Nyugat termelés (6 panel, ' + str(dnysum) + ' kWh)', 'Dél-Kelet termelés (10 panel, ' + str(dksum) + ' kWh)'],
          title='Átlagtermelés (összes: ' + str(ossz) + ' kWh, átlag: ' + str(avg) + ' kWh)  -  ' + ctx.date(), color=['mediumorchid', 'orange'])
plot.set_xlabel("Dátum")
plot.set_ylabel("Megtermelt energia")

plot = df.plot(x='Date', y='Átlag', ax=plot, color='green', label='30 napos átlag')
plot = df.plot(x='Date', y='TeljesÁtlag', ax=plot, color='magenta', label='Éves átlag (' + str(avg) + ' kWh)', linestyle='--')


yticks = mtick.FormatStrFormatter('%.0f kWh')
plot.yaxis.set_major_formatter(yticks)
plot.xaxis.set_tick_params(rotation = 90)

fig = plot.get_figure()
fig.set_size_inches(15, 7)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/ÉvesÁtlagTermelés%s.png"), bbox_inches = "tight")
