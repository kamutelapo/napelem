#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import matplotlib.ticker as mtick
import napelem_context
import matplotlib.pyplot as plt
from matplotlib import gridspec

BASEDIR=os.path.dirname(__file__) + "/.."

ctx = napelem_context.yearly(-1)
df = ctx.getJoinedDataframe()

class Battery:
    def __init__(self, capacity):
        self.loss = 0
        self.save = 0
        self.fill = 0
        self.capacity = capacity
        
    def apply(self, delta):
        if delta > 0:
            remaining = self.capacity - self.fill
            if delta > remaining:
                self.loss += delta - remaining
                delta = remaining
            self.fill += delta
        elif delta < 0:
            stored = self.fill + delta
            if stored < 0:
                stored = 0
            self.save += self.fill - stored
            self.fill = stored
            
    def to_dict(self):
        return {
            'Elvesztett energia': self.loss,
            'Eltárolt energia': self.save,
            'Akkumulátor kapacitás': self.capacity,
            'Eltárolt arány': 100 * self.save / (self.loss + self.save)
        }

            
batteries = []
for i in range(1, 31):
    batteries.append(Battery(i/2.0))

def applyBattery(delta):
    for batt in batteries:
        batt.apply(delta)

df.apply(lambda row: applyBattery(row["Termelés"] - row["Fogyasztás"]), axis = 1)

df = pd.DataFrame.from_records([b.to_dict() for b in batteries])
df['Eltárolt energiatöbblet'] = df['Eltárolt energia'].diff().fillna(df['Eltárolt energia'][0])

caplabels = df['Akkumulátor kapacitás'].values
caplabels = list(map(lambda x: str(x) + " kWh", caplabels))

# rajzolás
    
pd.plotting.register_matplotlib_converters()

fig=plt.figure(figsize=[10,8])

spec = gridspec.GridSpec(ncols=1, nrows=2,
                         width_ratios=[1], wspace=0.3,
                         hspace=0.40, height_ratios=[1, 1])
spec.update(left=0.06,right=0.95,top=0.90,bottom=0.08,wspace=0.25,hspace=0.50)

ax1=fig.add_subplot(spec[0], label="1")
ax1.set_title("Akkumulátorral hasznosított energia")

ax1par = ax1.twinx()

ax1.set_xticks(df['Akkumulátor kapacitás'].values)
pa1 = ax1.bar(df['Akkumulátor kapacitás'], df['Eltárolt energia'], label="Akkumulátorral hasznosított energia", zorder = 10, color = 'green', align='center', width = 0.3)
pa2 = ax1par.bar(df['Akkumulátor kapacitás'], df['Eltárolt arány'], label="Akkumulátorral hasznosított energia", zorder = 10, color = 'green', align='center', width = 0.3)
ax1par.grid(axis='y', zorder = -1)

ax1.set_ylabel("Eltárolt összes energia")
ax1par.set_ylabel("Eltárolt energia aránya")

yticks = mtick.FormatStrFormatter('%.0f kWh')
ax1.yaxis.set_major_formatter(yticks)
ax1.set_xticklabels(caplabels, rotation = 90)
yticks = mtick.FormatStrFormatter('%.0f%%')
ax1par.yaxis.set_major_formatter(yticks)

ax2=fig.add_subplot(spec[1], label="2")
ax2.set_title("Mennyit többletet produkál az akkumulátor az előző mérethez képest?")
ax2.set_xticks(df['Akkumulátor kapacitás'].values)
pa2 = ax2.bar(df['Akkumulátor kapacitás'], df['Eltárolt energiatöbblet'], label="Többlet az előző mérethez képest", zorder = 10, color = 'orange', align='center', width = 0.3)

yticks = mtick.FormatStrFormatter('%.0f kWh')
ax2.yaxis.set_major_formatter(yticks)
ax2.set_xticklabels(caplabels, rotation = 90)
ax2.set_ylabel("Eltárolt többlet energia")
ax2.grid(axis='y', zorder = -1)

fig.suptitle('Akkumulátor számítások', fontsize=22)
fig.savefig(BASEDIR + ctx.fileName("/képek/eon/Akkumulátor%s.png"), bbox_inches = "tight")
