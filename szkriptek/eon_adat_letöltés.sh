#!/bin/sh

BASEDIR=`dirname $0`/..
STOREDIR="$BASEDIR/adatok/eon/"
PROPERTY_FILE="$BASEDIR/base.properties"

EMAIL=$(cat $PROPERTY_FILE | grep "email=" | cut -d'=' -f2)
PASSWORD=$(cat $PROPERTY_FILE | grep "eon.password=" | cut -d'=' -f2)
REPORT_ID=$(cat $PROPERTY_FILE | grep "eon.reportid=" | cut -d'=' -f2)

C_YESTERDAY=`date -d yesterday '+%Y-%m-%d'`
C_MONTHSTART=`date -d yesterday '+%Y-%m-01'`
C_FILENAME=`date -d yesterday '+%Y-%m'`
if [ $YESTERDAY = $MONTHSTART ]; then
  C_YESTERDAY=`date --date='2 days ago' '+%Y-%m-%d'`
  C_MONTHSTART=`date --date='2 days ago' '+%Y-%m-01'`
  C_FILENAME=`date -d yesterday '+%Y-%m'`
fi

LAST_FULL_MONTH=`ls -1 $STOREDIR/????-??.csv | tail -1`
if [ -z $LAST_FULL_MONTH ]; then
  START_MONTH=`date -d "-3 month" +%Y-%m`
else
  BASENAME=$(basename -- $LAST_FULL_MONTH)
  START_MONTH=${BASENAME%.*}
fi

rm $STOREDIR/*.part.csv

while :
do
  if [ \( ! -f "$STOREDIR/$START_MONTH.csv" \) -o \( $START_MONTH = $C_FILENAME \) ]; then
    EXT=".csv"
    if [ $START_MONTH = $C_FILENAME ]; then
      EXT=".part.csv"
    fi
    
    echo "Downloading $START_MONTH$EXT"
      MONTHSTART="$START_MONTH-01"
      FILENAME=$START_MONTH
      MONTHEND=`date --date="$START_MONTH-01 + 1 month" '+%Y-%m-01'`

      DOWNLOADSTART=`date --date="$MONTHSTART - 1 days" '+%Y-%m-%d'`

      echo Belépés...
      rm -f $STOREDIR/Login.html
      curl -k -c $STOREDIR/cookie.txt https://energia.eon-hungaria.hu/W1000/Account/Login -o $STOREDIR/Login.html

      TOKEN=`cat $STOREDIR/Login.html | grep RequestVerification | head -1 | tr ' ' '\n' | grep value | sed -e 's/value=//' | sed -e 's/"//'g`
      echo TOKEN: $TOKEN

      rm $STOREDIR/Login.html

      curl -b $STOREDIR/cookie.txt -c $STOREDIR/cookie.txt -k -X POST -F "__RequestVerificationToken=$TOKEN" -F "UserName=$EMAIL" -F "Password=$PASSWORD" https://energia.eon-hungaria.hu/W1000/Account/Login -o /dev/null


      curl -b $STOREDIR/cookie.txt -c $STOREDIR/cookie.txt -k https://energia.eon-hungaria.hu/W1000/ >/dev/null



      curl -b $STOREDIR/cookie.txt -c $STOREDIR/cookie.txt -k -X POST -F "since=${DOWNLOADSTART}T16:00:00.000Z" -F "until=${MONTHEND}T08:00:00.000Z" -F "count=" -F "reportId=$REPORT_ID" -F "decimalSeparator=." -F "viewtype=3" -F "exportformat=3" -F "includestatus=true" https://energia.eon-hungaria.hu/W1000/ExportReport/Export -o $STOREDIR/${FILENAME}${EXT}

     rm $STOREDIR/cookie.txt
      
  fi

  
  if [ $START_MONTH = $C_FILENAME ]; then
    break
  fi
  START_MONTH=`date --date="$START_MONTH-01 + 1 month" '+%Y-%m'`
done

"$BASEDIR/szkriptek/eon_adat_egyesítés.py"
