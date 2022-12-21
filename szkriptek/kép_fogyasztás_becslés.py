#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os

BASEDIR=os.path.dirname(__file__) + "/.."

def ujAr(c):
    if c <= 210:
        return int(c * 36.9 + 0.5)
    return int((c - 210) * 70.1 + 210*36.9 + 0.5)


tegnap = dt.date.today() - dt.timedelta(days=1)

kezdet = np.datetime64(tegnap.replace(day=1))

honap_napok = pd.to_datetime(tegnap).days_in_month

df = pd.read_csv(BASEDIR +"/adatok/eon.csv", parse_dates=['Idő'])


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

maxvf = int(((dfsumma['Várható [kWh]'].max()) + 99) / 100) * 100 + 100

plot = dfsumma.plot(x='Dátum', y=['Várható [kWh]','Támogatott [kWh]'],
               title='Várható fogyasztás a hónap végére', color=['green','magenta'],
               ylim=[0, maxvf],
               kind='bar', zorder=10)
plot.grid(axis='y', zorder=-1)

fig = plot.get_figure()
fig.savefig(BASEDIR + "/képek/eon/VárhatóFogyasztás.png", bbox_inches = "tight")

maxar = int(((dfsumma['Ár'].max()) + 999) / 1000) * 1000 + 5000

plot = dfsumma.plot(x='Dátum', y=['Ár'],
               title='Várható ár a hónap végére', color=['orange'],
               ylim=[0, maxar],
               kind='bar', zorder=10)
plot.grid(axis='y', zorder=-1)


fig = plot.get_figure()
fig.savefig(BASEDIR + "/képek/eon/VárhatóÁr.png", bbox_inches = "tight")
