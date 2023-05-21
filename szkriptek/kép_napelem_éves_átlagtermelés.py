#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
from matplotlib import dates as mdates
from matplotlib.offsetbox import AnchoredText
from scipy import integrate
import napelem_context
import matplotlib as mpl

mpl.rcParams["legend.framealpha"] = 1

BASEDIR=os.path.dirname(__file__) + "/.."

ctx = napelem_context.yearly()
df = ctx.getDataframe()

df['Date'] = df['Time'].dt.date

df["D-K"] = (df["Vpv1"] * df["Ipv1"]).cumsum() * 300 / 3600
df["D-Ny"] = (df["Vpv2"] * df["Ipv2"]).cumsum()  * 300 / 3600

pacmaxidx = df['Pac'].idxmax()
powermaxdate = df.loc[pacmaxidx]['Date']
powermaxvalue = int(df.loc[pacmaxidx]['Pac'])

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

ossz = df["Termelés"].sum()
dksum = int(100 * df["D-K termelés"].sum() + 0.5) / 100
dnysum = int(100 * df["D-Ny termelés"].sum() + 0.5) / 100

numdays = (df["Date"].max() - df["Date"].min()).days + 1
avg = ossz / numdays
avg = int(avg * 100 + 0.5) / 100

df = df[["Date", "D-K termelés", "D-Ny termelés"]]

df['Termelés'] = df["D-K termelés"]+df["D-Ny termelés"]

dminidx = df['Termelés'].idxmin()
dmaxidx = df['Termelés'].idxmax()

dmindate = df.loc[dminidx]['Date']
dmin = df.loc[dminidx]['Termelés']

dmaxdate = df.loc[dmaxidx]['Date']
dmax = df.loc[dmaxidx]['Termelés']

dfhavi = df.rolling(30, center=True).mean().dropna()

hminidx = dfhavi["Termelés"].idxmin()
hmaxidx = dfhavi["Termelés"].idxmax()

hmin = dfhavi.loc[hminidx]["Termelés"]
hmax = dfhavi.loc[hmaxidx]["Termelés"]

hmindate = df.loc[hminidx]['Date']
hminstart = hmindate + dt.timedelta(days = -15)
hminend = hmindate + dt.timedelta(days = 14)
hmindate = str(hminstart) + " - " + str(hminend)

hmaxdate = df.loc[hmaxidx]['Date']
hmaxstart = hmaxdate + dt.timedelta(days = -15)
hmaxend = hmaxdate + dt.timedelta(days = 14)
hmaxdate = str(hmaxstart) + " - " + str(hmaxend)


dfavg = df.rolling(7, center=True).mean()
dfavg["Date"] = df["Date"]

dfavg2=df.copy()
dfavg2["Átlag"] = df["D-K termelés"]+df["D-Ny termelés"]

dfavg2 = dfavg2.rolling(30, center=True, min_periods=0).mean()

dfavg["Átlag"] = dfavg2["Átlag"]
dfavg["TeljesÁtlag"] = avg


df = dfavg.dropna().copy()

minavgidx = df["Termelés"].idxmin()
maxavgidx = df["Termelés"].idxmax()

minavg = df.loc[minavgidx]["Termelés"]
maxavg = df.loc[maxavgidx]["Termelés"]

minavgdate = df.loc[minavgidx]['Date']
minavgstart = minavgdate + dt.timedelta(days = -3)
minavgend = minavgdate + dt.timedelta(days = 3)
minavgdate = str(minavgstart) + " - " + str(minavgend)

maxavgdate = df.loc[maxavgidx]['Date']
maxavgstart = maxavgdate + dt.timedelta(days = -3)
maxavgend = maxavgdate + dt.timedelta(days = 3)
maxavgdate = str(maxavgstart) + " - " + str(maxavgend)

ylim = max(df["D-K termelés"]+df["D-Ny termelés"]) * 1.3

plot = df.plot.area(x='Date', y=['D-Ny termelés', 'D-K termelés'], linewidth = 0,
          label=['Dél-Nyugat termelés (6 panel, ' + napelem_context.pretty(dnysum) + ' kWh)', 'Dél-Kelet termelés (10 panel, ' +
                 napelem_context.pretty(dksum) + ' kWh)'], zorder = 10,
          title='Éves átlagtermelés (összes: ' + napelem_context.pretty(ossz) + ' kWh, éves átlag: ' + napelem_context.pretty(avg) + ' kWh)  -  ' + ctx.date(), color=['mediumorchid', 'orange'], ylim = [0, ylim])
plot.set_ylabel("Megtermelt energia")
plot.legend(loc='upper right')

plot = df.plot(x='Date', y='Átlag', ax=plot, color='green', label='30 napos átlag', zorder = 10)
plot = df.plot(x='Date', y='TeljesÁtlag', ax=plot, color='magenta', label='Éves átlag (' + napelem_context.pretty(avg) + ' kWh)', linestyle='--', zorder = 10)

plot.set_xlabel("Dátum")

at = AnchoredText("Minimum és maximum értékek:\n" +
                  "- havi átlag minimum: " + napelem_context.pretty(hmin) + " kWh (teljes: " + napelem_context.pretty(hmin * 30) + " kWh)  [" + hmindate + "]\n" +
                  "- havi átlag maximum: " + napelem_context.pretty(hmax) + " kWh (teljes: " + napelem_context.pretty(hmax * 30) + " kWh)  [" + hmaxdate + "]\n" +
                  "- heti átlag minimum: " + napelem_context.pretty(minavg) + " kWh (teljes: " + napelem_context.pretty(minavg * 7) + " kWh)  [" + minavgdate + "]\n" +
                  "- heti átlag maximum: " + napelem_context.pretty(maxavg) + " kWh (teljes: " + napelem_context.pretty(maxavg * 7) + " kWh)  [" + maxavgdate + "]\n" +
                  "- napi minimum: " + napelem_context.pretty(dmin) + " kWh  [" + str(dmindate) + "]\n" +
                  "- napi maximum: " + napelem_context.pretty(dmax) + " kWh  [" + str(dmaxdate) + "]\n" +
                  "- maximális teljesítmény: " + napelem_context.pretty(powermaxvalue) + "W  [" + str(powermaxdate) + "]",
                  loc='upper left', prop=dict(fontfamily="sans-serif", fontsize=8.5), frameon=True)
at.patch.set_boxstyle("round,pad=0.,rounding_size=0.2")
at.patch.set_edgecolor("lightgrey")
plot.add_artist(at)
plot.grid(axis='y', zorder = -1, color = 'lightgrey')

yticks = mtick.FormatStrFormatter('%.0f kWh')
plot.yaxis.set_major_formatter(yticks)
plot.xaxis.set_tick_params(rotation = 90)

fig = plot.get_figure()
fig.set_size_inches(15, 7)
fig.savefig(BASEDIR + ctx.fileName("/képek/inverter/ÉvesÁtlagTermelés%s.png"), bbox_inches = "tight")
