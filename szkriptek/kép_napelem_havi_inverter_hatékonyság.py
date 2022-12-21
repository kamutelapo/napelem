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

df["DC"] = (df["Vpv1"] * df["Ipv1"] + df["Vpv2"] * df["Ipv2"]).cumsum() * 300 / 3600
df["AC"] = df["E-Total"] * 1000

dffirst = df.groupby("Date").first()
dffirst = dffirst[['DC', 'AC']].reset_index() \
    .rename(columns = {'DC': 'DC kezdet', 'AC': 'AC kezdet'})
dflast = df.groupby("Date").last()
dflast = dflast[['DC', 'AC']].reset_index() \
    .rename(columns = {'DC': 'DC vég', 'AC': 'AC vég'})

df = pd.merge(dffirst, dflast, left_on = 'Date', right_on = 'Date')

df["DC termelés"] = df['DC vég'] - df['DC kezdet']
df["AC termelés"] = df['AC vég'] - df['AC kezdet']
df["Inverter hatékonyság"] = 100 * df["AC termelés"] / df["DC termelés"]

osszdc = df.sum()["DC termelés"]
osszac = df.sum()["AC termelés"]

hatekonysag = 100 * osszac / osszdc
hatekonysag = int(100* hatekonysag + 0.5) / 100

veszteseg = (100 - hatekonysag) * osszdc / 100000

veszteseg = str(int(100* veszteseg + 0.5) / 100)


maxy = ctx.roundUp(5, (df["Inverter hatékonyság"]).max()) * 1.1

plot = df.plot(x='Date', y=['Inverter hatékonyság'],
               label=['Inverter hatékonyság'],
               title='Inverter hatékonyság [teljes: ' + str(hatekonysag) + '%, veszteség: ' + veszteseg + ' kWh]  -  ' + ctx.date(),
               color=['green'], kind='bar', zorder = 10, stacked=True,ylim=[0, maxy])
plot.set_xlabel("Dátum")
plot.grid(axis='y', zorder = -1)
plot.axhline(hatekonysag,color='magenta',ls='--')

yticks = mtick.FormatStrFormatter('%.0f%%')
plot.yaxis.set_major_formatter(yticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/HaviInverterHatékonyság%s.png"), bbox_inches = "tight")
