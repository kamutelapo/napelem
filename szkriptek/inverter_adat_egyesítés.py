#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import datetime as dt
import os
from os.path import exists
import re

BASEDIR=os.path.dirname(__file__) + "/../adatok/inverter"

dircontent = sorted(os.listdir(BASEDIR))
dircontent = list(filter(lambda x: re.search('\d\d\d\d-\d\d-\d\d(?:\.part)?\.csv', x), dircontent))
start_day = dircontent[0].replace(".part", "").replace(".csv", "")

aktualis_nap = pd.to_datetime(start_day)

teljes = None

df = None

while( aktualis_nap <= dt.date.today() ):
  
  fajlnev = aktualis_nap.strftime('%Y-%m-%d.csv')
  
  if( not exists (BASEDIR +"/" + fajlnev) ):
    fajlnev = aktualis_nap.strftime('%Y-%m-%d.part.csv')

  df_read = pd.read_csv(BASEDIR +"/" + fajlnev, parse_dates=['Time'])
  
  if df is None:
      df = df_read
  else:
      df = pd.concat([df, df_read])  

  aktualis_nap = aktualis_nap + pd.DateOffset(days=1)
  
df.to_csv(BASEDIR + "/../inverter.csv", index = False)
