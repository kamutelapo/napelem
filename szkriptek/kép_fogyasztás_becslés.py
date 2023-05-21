#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick

BASEDIR=os.path.dirname(__file__) + "/.."

def ujAr(c):
    if c < 0:
        return int(c * 5.11 - 0.5)
    if c <= 210:
        return int(c * 36.9 + 0.5)
    return int((c - 210) * 70.1 + 210*36.9 + 0.5)


tegnap = dt.date.today() - dt.timedelta(days=1)

kezdet = np.datetime64(tegnap.replace(day=1))

honap_napok = pd.to_datetime(tegnap).days_in_month

df = pd.read_csv(BASEDIR +"/adatok/eon.csv", parse_dates=['Idő'])
dfteljes = df.copy()

df = df[df['Idő'] >= kezdet]
df = df[df['Idő'] < np.datetime64('today')]

df['Dátum'] = pd.to_datetime(df['Idő']).dt.date

dfsumma = df.groupby('Dátum').sum().reset_index()[['Dátum', 'Energia egyenleg']]
dfsumma['Nap'] = pd.to_datetime(dfsumma['Dátum']).dt.day
dfsumma['Energia egyenleg'] = -dfsumma['Energia egyenleg']

dfsumma['Összes [kWh]'] = dfsumma['Energia egyenleg'].cumsum()
dfsumma['Várható [kWh]'] = dfsumma.apply(lambda row: row['Összes [kWh]'] / row['Nap'] * honap_napok, axis=1)
dfsumma['Támogatott [kWh]'] = 210
dfsumma['Ár'] = np.vectorize(ujAr)(dfsumma['Várható [kWh]'])

print (dfsumma)

maxvfn = dfsumma['Várható [kWh]'].max()
if maxvfn < 210:
    maxvfn = 210

maxvf = int((maxvfn + 99) / 100) * 100 + 100
minvf = int(((dfsumma['Várható [kWh]'].min()) - 99) / 100) * 100
if minvf > 0:
    minvf = 0

plot = dfsumma.plot(x='Dátum', y=['Várható [kWh]','Támogatott [kWh]'],
               label=['Várható','Támogatott'],
               title='Várható fogyasztás a hónap végére', color=['green','magenta'],
               ylim=[minvf, maxvf],
               kind='bar', zorder=10)
plot.grid(axis='y', zorder=-1)
plot.axhline(0,color='black', linewidth=1, zorder = 20)

yticks = mtick.FormatStrFormatter('%.0f kWh')
plot.yaxis.set_major_formatter(yticks)

fig = plot.get_figure()
fig.savefig(BASEDIR + "/képek/eon/VárhatóFogyasztás.png", bbox_inches = "tight")

delta = -dfsumma['Ár'].min()
if delta < 0:
    delta = 0
delta += dfsumma['Ár'].max()
delta *= 0.1

maxar = int(((delta + dfsumma['Ár'].max()) + 999) / 1000) * 1000
minar = int(((dfsumma['Ár'].min()) - 999) / 1000) * 1000
if minar > 0:
    minar = 0

plot = dfsumma.plot(x='Dátum', y=['Ár'],
               title='Várható ár a hónap végére', color=['orange'],
               ylim=[minar, maxar],
               kind='bar', zorder=10)
plot.grid(axis='y', zorder=-1)

yticks = mtick.FormatStrFormatter('%.0f Ft')
plot.yaxis.set_major_formatter(yticks)
plot.axhline(0,color='black', linewidth=1, zorder = 20)

fig = plot.get_figure()
fig.savefig(BASEDIR + "/képek/eon/VárhatóÁr.png", bbox_inches = "tight")

df = dfteljes
df = df[df['Idő'] >= '2022-10-19']

days = (df['Idő'].max() - df['Idő'].min()).days
cheap = days * 7
kwh = (df['Fogyasztás'] - df['Termelés']).sum()

cheap_part = kwh
expensive_part = 0

if cheap_part > cheap:
    expensive_part = kwh - cheap
    cheap_part = cheap

ar = 36 * cheap_part + 70.1 * expensive_part
altalany = int(ar / days * 30 + 0.5)

ar = int(ar + 0.5)

print ("\nÉves számla:", ar, "Ft, általány:", altalany, "Ft")
print ("Támogatott:", int(cheap_part * 100 + 0.5) / 100, "kWh, emelt árú:", int(expensive_part * 100 + 0.5) / 100, "kWh")
print ("Napi fogyasztás: ", int((kwh / days) * 100 + 0.5) / 100, "kWh")


