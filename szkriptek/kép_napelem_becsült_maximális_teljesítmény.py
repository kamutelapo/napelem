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

def becsles(dfr):
    maxp = -1
    arr = []
    for p in dfr:
        if p >= maxp:
            arr.append(p)
            maxp = p
        else:
            arr.append(np.nan)
    
    maxp = -1
    pos = len(arr) - 1

    for p in dfr[::-1]:
        if p >= maxp:
            arr[pos] = p
            maxp = p
        pos-=1
        
    return np.array(arr)
            
ctx = napelem_context.daily()
df = ctx.getDataframe()

df["D-K teljesítmény"] = df["Vpv1"] * df["Ipv1"]
df["D-Ny teljesítmény"] = df["Vpv2"] * df["Ipv2"]

maxi1 = df["Ipv1"].max()
maxi2 = df["Ipv2"].max()

if maxi1 < 4 or maxi2 < 4:
    print("Becslési hiba: kevés áram!")
    quit()

dfc = df.copy()
dfc.replace(0, np.nan, inplace=True)

maxdiff12 = (dfc["Ipv1"] / dfc["Ipv2"]).max()
maxdiff21 = (dfc["Ipv2"] / dfc["Ipv1"]).max()

if maxdiff12 < 2.5 or maxdiff21 < 2.5:
    print("Becslési hiba: szélső értékek hiányoznak!")
    quit()

df["Becsült D-K"] = becsles(df["D-K teljesítmény"]).tolist()
df["Becsült D-K"] = df["Becsült D-K"].interpolate()
df["Becsült D-Ny"] = becsles(df["D-Ny teljesítmény"]).tolist()
df["Becsült D-Ny"] = df["Becsült D-Ny"].interpolate()

df["Teljesítmény"] = df["D-K teljesítmény"] + df["D-Ny teljesítmény"]
df["Becsült teljesítmény"] = df["Becsült D-K"] + df["Becsült D-Ny"]

maxy = ctx.roundUp(250, df["Becsült teljesítmény"]) * 1.1

time_series = df["Time"].diff().dt.total_seconds().fillna(0).cumsum().values

simpson_dny = integrate.simps(df["D-Ny teljesítmény"], time_series) / 3600
simpson_dk = integrate.simps(df["D-K teljesítmény"], time_series) / 3600

simpson_bdny = integrate.simps(df["Becsült D-Ny"], time_series) / 3600
simpson_bdk = integrate.simps(df["Becsült D-K"], time_series) / 3600

teljmax = simpson_dk + simpson_dny
teljmaxb = simpson_bdk + simpson_bdny

tmert = df["E-Total"].max() - df["E-Total"].min()
tmertb = tmert / teljmax * teljmaxb

tmert = int(tmert * 100 + 0.5) / 100
tmertb = int(tmertb * 100 + 0.5) / 100

df["Diff"] = df["Becsült teljesítmény"] - df["Teljesítmény"]


plot = df.plot.area(x='Time', y=['Teljesítmény','Diff'],
          label=['Mért teljesítmény (' + str(tmert) + ' kWh)',
                 'Becsült maximális teljesítmény (' + str(tmertb) + ' kWh)'],
          title='Napelem panelek becsült maximális teljesítménye  -  ' + ctx.date(), color=['orange','#bf6800'],
          ylim = [0, maxy], linewidth = 0, zorder = 10)
plot.grid(axis='y', zorder = -1)
plot.set_xlabel("Idő")

yticks = mtick.FormatStrFormatter('%.0fW')
plot.yaxis.set_major_formatter(yticks)
xticks = mdates.DateFormatter('%H:%M')
plot.xaxis.set_major_formatter(xticks)

fig = plot.get_figure()
fig.set_size_inches(10, 6)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/BecsültMaximálisTeljesítmény%s.png"), bbox_inches = "tight")
