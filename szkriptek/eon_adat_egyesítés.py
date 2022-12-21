#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
import re
from os.path import exists

BASEDIR=os.path.dirname(__file__) + "/../adatok/eon"

dircontent = sorted(os.listdir(BASEDIR))
dircontent = list(filter(lambda x: re.search('\d\d\d\d-\d\d(?:\.part)?\.csv', x), dircontent))
start_month = dircontent[0].replace(".part", "").replace(".csv", "")

honap_start = pd.to_datetime(start_month + '-01')
ma = np.datetime64('today')

teljes = None

while( honap_start < dt.date.today() ):
  honap_veg = honap_start + pd.DateOffset(months=1)
  
  fajlnev = honap_start.strftime('%Y-%m.csv')
  
  if( not exists (BASEDIR +"/" + fajlnev) ):
    fajlnev = honap_start.strftime('%Y-%m.part.csv')
  
  df = pd.read_csv(BASEDIR +"/" + fajlnev, parse_dates=['Idő'], delimiter=';')

  df = df[df['Idő'] >= honap_start]
  df = df[df['Idő'] < honap_veg]
  df = df[df['Idő'] < ma]
  
  df_fogy = df[df['Változó név'] == "'+A'"]
  df_fogy = df_fogy.rename(columns = {'Érték [kWh]': 'Fogyasztás'}, inplace = False)
  df_term = df[df['Változó név'] == "'-A'"]
  df_term = df_term.rename(columns = {'Érték [kWh]': 'Termelés'}, inplace = False)
  
  df = df[df['Változó név'] == "'+A'"]
  df = df[['Idő']]
  
  df = pd.merge(df, df_fogy[['Idő', 'Fogyasztás']], left_on = 'Idő', right_on = 'Idő')
  df = pd.merge(df, df_term[['Idő', 'Termelés']], left_on = 'Idő', right_on = 'Idő')
  
  df['Energia egyenleg'] = df['Termelés'] - df['Fogyasztás']
  
  if teljes is None:
      teljes = df
  else:
      teljes = pd.concat([teljes, df])
  
  honap_start = honap_veg

teljes['Összes fogyasztás'] = teljes['Fogyasztás'].cumsum(axis = 0)
teljes['Összes termelés'] = teljes['Termelés'].cumsum(axis = 0)

teljes['Nap'] = teljes.apply(lambda row: row['Idő'].date(), axis=1)


napi = (teljes[['Nap', 'Fogyasztás', 'Termelés']].groupby('Nap', as_index=False).sum())
napi = napi.rename(columns = {'Fogyasztás': 'Napi fogyasztás', 'Termelés': 'Napi termelés'}, inplace = False)

teljes = pd.merge(teljes, napi, left_on = 'Nap', right_on = 'Nap', how = 'left')

teljes.to_csv(BASEDIR + "/../eon.csv", index = False)
