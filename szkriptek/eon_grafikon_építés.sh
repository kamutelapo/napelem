#!/bin/sh

BASEDIR=`dirname $0`

"$BASEDIR/kép_fogyasztás_becslés.py"
"$BASEDIR/kép_napi_fogyasztás_termelés.py"
"$BASEDIR/kép_heti_fogyasztás_termelés.py"
"$BASEDIR/kép_pillanatnyi_fogyasztás_termelés.py"
"$BASEDIR/kép_havi_fogyasztás_termelés.py"
"$BASEDIR/kép_éves_szaldó.py"
"$BASEDIR/kép_heti_szaldó.py"
