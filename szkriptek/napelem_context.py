#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import pandas as pd
import datetime as dt
import dateutil.relativedelta
import locale

locale.setlocale(locale.LC_TIME, 'hu_HU.UTF-8')

BASEDIR=os.path.dirname(__file__) + "/.."

def daily():
    ctx = NapelemContext()
    ctx.daily()
    return ctx
    
def monthly(defaultDateOffsetInDays = 0):
    ctx = NapelemContext()
    ctx.monthly(defaultDateOffsetInDays)
    return ctx

def yearly(defaultDateOffsetInDays = 0):
    ctx = NapelemContext()
    ctx.yearly(defaultDateOffsetInDays)
    return ctx

def pretty(num):
    return ("%.2f" % num).rstrip("0").rstrip(".")

class NapelemContext:
    def __init__(self):
        self.df = pd.read_csv(BASEDIR +"/adatok/inverter.csv", parse_dates=['Time'])
        pass
    
    def daily(self):
        if len(os.sys.argv) == 2:
            argdate = os.sys.argv[1]
            self.mindate = pd.to_datetime(argdate)
            self.filesuffix = "-" + str(self.mindate.date())
        else:
            self.mindate = pd.to_datetime(dt.date.today())
            self.filesuffix = ""
        self.maxdate = self.mindate + pd.DateOffset(days = 1)
        self.df = self.filter(self.df, 'Time')
        self.datetext = str(self.mindate.date())

    def monthly(self, defaultDateOffsetInDays):
        if len(os.sys.argv) == 2:
            argdate = os.sys.argv[1]
            self.mindate = pd.to_datetime(argdate)
            self.maxdate = self.mindate + dateutil.relativedelta.relativedelta(months=1)

            if self.mindate.day == 1:
              self.filesuffix = "-" + self.mindate.strftime('%Y-%m')
              self.datetext = self.mindate.strftime('%Y-%m')
            else:
              showdate = self.maxdate + dateutil.relativedelta.relativedelta(days=-1)
              self.filesuffix = "-" + self.mindate.strftime('%Y-%m-%d')
              self.datetext = "[" + str(self.mindate.date()) + " - " + str(showdate.date()) + "]"
        else:
            currentDate = pd.to_datetime(dt.date.today() + dateutil.relativedelta.relativedelta(days=defaultDateOffsetInDays))
            self.maxdate = currentDate + dateutil.relativedelta.relativedelta(days=1)
            self.mindate = pd.to_datetime(self.maxdate - dateutil.relativedelta.relativedelta(months=1))
            self.filesuffix = ""
            self.datetext = "[" + str(self.mindate.date()) + " - " + str(currentDate.date()) + "]"
        self.df = self.filter(self.df, 'Time')

    def yearly(self, defaultDateOffsetInDays):
        if len(os.sys.argv) == 2:
            argdate = os.sys.argv[1]
            self.mindate = pd.to_datetime(argdate)
            self.maxdate = self.mindate + dateutil.relativedelta.relativedelta(years=1)
            self.filesuffix = "-" + self.mindate.strftime('%Y')
            self.datetext = self.mindate.strftime('%Y')
        else:
            currentDate = pd.to_datetime(dt.date.today() + dateutil.relativedelta.relativedelta(days=defaultDateOffsetInDays))
            self.maxdate = currentDate + dateutil.relativedelta.relativedelta(days=1)
            self.mindate = pd.to_datetime(self.maxdate - dateutil.relativedelta.relativedelta(years=1))
            self.filesuffix = ""
            self.datetext = "[" + str(self.mindate.date()) + " - " + str(currentDate.date()) + "]"
        self.df = self.filter(self.df, 'Time')

    def filter(self, dfin, field):
        dfin = dfin[dfin[field] >= self.mindate]
        dfin = dfin[dfin[field] < self.maxdate]
        return dfin
    
    def getDataframe(self):
        return self.df

    def getJoinedDataframe(self):
        self.joineddf = pd.read_csv(BASEDIR +"/adatok/egyesített.csv", parse_dates=['Idő', 'Nap'])
        self.joineddf = self.filter(self.joineddf, 'Idő')

        return self.joineddf
    
    def date(self):
        return self.datetext

    def fileName(self, name):
        return name.replace("%s", self.filesuffix)

    def roundUp(self, limit, *dfs):
        maxa = None
        for df in dfs:
            maxv = df.max()
            if maxa is None:
                maxa = maxv
            else:
                maxa = max(maxa, maxv)

        limdelta = limit - limit / 100
        
        return int((maxa + limdelta) / limit) * limit
