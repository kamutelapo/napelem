#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
import napelem_context

BASEDIR=os.path.dirname(__file__) + "/.."

ctx = napelem_context.monthly(-1)
df = ctx.getJoinedDataframe()

dffirst = df.groupby("Nap").first()
dffirst = dffirst[['Összes fogyasztás', 'Összes termelés', 'Összes napelem fogyasztás']].reset_index() \
    .rename(columns = {'Összes fogyasztás': 'Összes fogyasztás kezdet', 'Összes termelés': 'Összes termelés kezdet', 'Összes napelem fogyasztás': 'Összes napelem fogyasztás kezdet'})
dflast = df.groupby("Nap").last()
dflast = dflast[['Összes fogyasztás', 'Összes termelés', 'Összes napelem fogyasztás']].reset_index() \
    .rename(columns = {'Összes fogyasztás': 'Összes fogyasztás vég', 'Összes termelés': 'Összes termelés vég', 'Összes napelem fogyasztás': 'Összes napelem fogyasztás vég'})

df = pd.merge(dffirst, dflast, left_on = 'Nap', right_on = 'Nap')

df["Összes fogyasztás"] = - (df['Összes fogyasztás vég'] - df['Összes fogyasztás kezdet'])
df["Összes termelés"] = df['Összes termelés vég'] - df['Összes termelés kezdet']
df["Összes napelem fogyasztás"] = df['Összes napelem fogyasztás vég'] - df['Összes napelem fogyasztás kezdet']

fogyasztas_kwh = -df['Összes fogyasztás'].sum()
napelem_fogyasztas_kwh = df['Összes napelem fogyasztás'].sum()
termeles_kwh = df['Összes termelés'].sum()

ossz = fogyasztas_kwh + napelem_fogyasztas_kwh + termeles_kwh
perc_fogy = 100 * fogyasztas_kwh / ossz
perc_napfogy = 100 * napelem_fogyasztas_kwh / ossz
perc_term = 100 * termeles_kwh / ossz

plot = df.plot.area(x='Nap', y=['Összes fogyasztás', 'Összes napelem fogyasztás', 'Összes termelés'], linewidth = 0,
          label=['Fogyasztás: ' + napelem_context.pretty(fogyasztas_kwh) + ' kWh, ' + napelem_context.pretty(perc_fogy) + "%", \
                 'Napelemből fogyasztás: ' + napelem_context.pretty(napelem_fogyasztas_kwh) + ' kWh, ' + napelem_context.pretty(perc_napfogy) + "%", \
                 'Visszatáplált termelés: ' + napelem_context.pretty(termeles_kwh) + ' kWh, ' + napelem_context.pretty(perc_term) + "%"],
          zorder=3,title='Havi fogyasztás és termelés  -  ' + ctx.date(), color=['green', 'royalblue', 'cornflowerblue'])

yticks = mtick.FormatStrFormatter('%.0f kWh')
plot.yaxis.set_major_formatter(yticks)
plot.xaxis.label.set_visible(False)
plot.grid(axis='y', zorder = -1, color = 'lightgrey')

fig = plot.get_figure()
fig.set_size_inches(10, 5)
fig.savefig(BASEDIR + ctx.fileName("/képek/eon/HaviFogyasztásÉsTermelés%s.png"), bbox_inches = "tight")
