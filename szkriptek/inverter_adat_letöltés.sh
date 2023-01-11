#!/bin/sh

BASEDIR=`dirname $0`/..
STOREDIR="$BASEDIR/adatok/inverter/"
PROPERTY_FILE="$BASEDIR/base.properties"

USER=$(cat $PROPERTY_FILE | grep "inverter.user" | cut -d'=' -f2)
PASSWORD=$(cat $PROPERTY_FILE | grep "inverter.password" | cut -d'=' -f2)

CLOUD="cloud.solplanet.net"

rm $STOREDIR/*.part.*

echo Belépés...
rm -f $STOREDIR/Login.html

curl -c $STOREDIR/cookie.txt https://$CLOUD/login -o $STOREDIR/Login.html


curl -b $STOREDIR/cookie.txt -c $STOREDIR/cookie.txt -X POST  -d "username=$USER" -d "password=$PASSWORD" https://$CLOUD/login -o /dev/null

curl -b $STOREDIR/cookie.txt -c $STOREDIR/cookie.txt https://$CLOUD/station -o $STOREDIR/Station.html

STATION_ID=`cat $STOREDIR/Station.html | grep data-stationid | head -1 | tr ' ' '\n' | grep data-stationid | sed -e 's/data-stationid=//'  | sed -e 's/"//'g`
echo STATION_ID: $STATION_ID


curl -b $STOREDIR/cookie.txt -c $STOREDIR/cookie.txt https://$CLOUD/config/equip/deviceList?stationId=$STATION_ID -o $STOREDIR/DeviceList.json


DEVICE_ID=`cat $STOREDIR/DeviceList.json | tr ',' '\n' | tr '{' '\n' | grep '"isno"' | head -1 | sed -e 's/"isno"://' | sed -e 's/"//'g`
echo DEVICE_ID: $DEVICE_ID

TODAY=`date '+%Y-%m-%d'`

DOWNLOAD_DATE=`ls -1 $STOREDIR | grep ".csv" | sort | tail -1 | sed -e s/.csv//`

if [ -z $DOWNLOAD_DATE ]; then
  DOWNLOAD_DATE=`date --date="$DOWNLOAD_DATE - 3 months"  '+%Y-%m-%d'`
else
  DOWNLOAD_DATE=`date --date="$DOWNLOAD_DATE + 1 days"  '+%Y-%m-%d'`  
fi

while :
do
  DATED_FILENAME=$DOWNLOAD_DATE

  if [ $DOWNLOAD_DATE = $TODAY ]; then
      DATED_FILENAME=$DOWNLOAD_DATE.part
  fi

  curl -b $STOREDIR/cookie.txt -c $STOREDIR/cookie.txt -X POST -d "downloadSid=$STATION_ID" -d "deviceList=$DEVICE_ID" -d "dataClassification=inv_data" -d "search_EQ_sdate=$DOWNLOAD_DATE" -d "search_EQ_edate=$DOWNLOAD_DATE" -d "selectFileds=Pac" -d "selectFileds=Fac" -d "selectFileds=Temp" -d "selectFileds=E-Today" -d "selectFileds=E-Total" -d "selectFileds=H-Total" -d "selectFileds=Ipv1" -d "selectFileds=Ipv2" -d "selectFileds=Ipv3" -d "selectFileds=Vpv1" -d "selectFileds=Vpv2" -d "selectFileds=Vpv3" -d "selectFileds=Vac1" -d "selectFileds=Vac2" -d "selectFileds=Vac3" -d "selectFileds=Iac1" -d "selectFileds=Iac2" -d "selectFileds=Iac3" https://$CLOUD/management/inv/downloadAll/$DEVICE_ID -o $STOREDIR/$DATED_FILENAME.xls

  libreoffice --headless --convert-to csv $STOREDIR/$DATED_FILENAME.xls --outdir $STOREDIR
  rm $STOREDIR/$DATED_FILENAME.xls

  echo "Downloaded $DATED_FILENAME.csv"
  
  if [ $DOWNLOAD_DATE = $TODAY ]; then
    break
  else
    DOWNLOAD_DATE=`date --date="$DOWNLOAD_DATE + 1 days"  '+%Y-%m-%d'`  
  fi
done

# TODO

rm -f $STOREDIR/Login.html
rm -f $STOREDIR/Station.html
rm -f $STOREDIR/DeviceList.json
rm -f $STOREDIR/cookie.txt

"$BASEDIR/szkriptek/inverter_adat_egyesítés.py"
