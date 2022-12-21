#!/bin/sh

BASEDIR=`dirname $0`

"$BASEDIR/szkriptek/eon_adat_letöltés.sh"
"$BASEDIR/szkriptek/inverter_adat_letöltés.sh"
"$BASEDIR/szkriptek/eon_inverter_adat_egyesítés.py"
"$BASEDIR/szkriptek/eon_grafikon_építés.sh"
"$BASEDIR/szkriptek/inverter_grafikon_építés.sh"
