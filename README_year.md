- [Egy év termelésének kiértékelése](#egy-év-termelésének-kiértékelése)
  - [Ha van adat, van miről beszélni, ha nincs adat, nincs miről](#ha-van-adat-van-miről-beszélni-ha-nincs-adat-nincs-miről)
  - [Egy elektromos rendszer működésének megértése](#egy-elektromos-rendszer-működésének-megértése)
    - [Hogyan fogyaszt egy háztartás 10 másodperces bontásban](#hogyan-fogyaszt-egy-háztartás-10-másodperces-bontásban)
    - [Hogyan termel a napelem 10 másodperces bontásban](#hogyan-termel-a-napelem-10-másodperces-bontásban)
    - [Miért nem probléma a tüskés fogyasztás és termelés?](#miért-nem-probléma-a-tüskés-fogyasztás-és-termelés)
  - [Az éves termelés kiértékelése](#az-éves-termelés-kiértékelése)
    - [Fogyasztás és termelés](#fogyasztás-és-termelés)
    - [Heti szaldó](#heti-szaldó)
    - [Éves szaldó](#éves-szaldó)
    - [Fogyasztás és termelés heti átlagban](#fogyasztás-és-termelés-heti-átlagban)
  - [Kormányzati megoldások és problémái](#kormányzati-megoldások-és-problémái)
    - [Visszwatt problémái](#visszwatt-problémái)
    - [Az ipar által javasolt 15 perces szaldó](#az-ipar-által-javasolt-15-perces-szaldó)
    - [Lehetne-e akkumulátort berakni a tüskék kiegyenlítésére?](#lehetne-e-akkumulátort-berakni-a-tüskék-kiegyenlítésére)
    - [Bruttó elszámolás mérőóra-állás alapján](#bruttó-elszámolás-mérőóra-állás-alapján)
  - [Az éves adatok megtekintése](#az-éves-adatok-megtekintése)
  
# Egy év termelésének kiértékelése

Egy éve működik a napelem a házunkban, a dokumentumban kiértékelem az elmúlt év tapasztalatait.
 
## Ha van adat, van miről beszélni, ha nincs adat, nincs miről

Egy év működés termelési és fogyasztási adatait beszerezni nem egyszerű történet, nem is biztos, hogy nem informatikus végzettségűeknek sikerül.

Problémák: (adatvesztés szerencsére nem történt)

 * EON távleolvasási portál gyakran megállt, volt hogy egy hónapot csúszott a frissítés és adatot is vesztettek, de szerencsére máshonnan sikerült megszerezni
 * A Solplanet inverter webalkalmazását egyik napról a másikra lecserélték egy használhatatlanra, az alkalmazás nyomkövetéséből kellett sokáig hozzájutni az adatokhoz. Náluk is történt rendszerhiba miatt adatvesztés, de arról is volt saját adatom.

Az év közepére tisztázódott a felhőalapú szolgáltatások csodálatos minősége, meg az, hogy ha komoly adatvesztés nélkül végig akarom csinálni az évet, a legjobb, ha nem bízok sem az EON, sem a Solplanet felhő alapú rendszereiben.

Megoldásként saját mintavételezési rendszert készítettem Raspberry Pi alá, ami közvetlenül a mérőóráról (P1 porton) és az invertertől (helyi hálózaton) 10 másodpercenként gyűjti be az adatokat. Nehézséget a 7/24-es működés okozott, ami a Raspberry Pi-nek maximum egy újraindulást engedett meg.

A 10 másodpercenkénti adatgyűjtésből nagyon finom képet kaphattam a rendszer működéséről.

Sokáig megbízhatóan sikerült menteni az adatokat, amíg a Raspberry Pi SD kártyája tönkre nem ment, a Pi megállt és a javításig ismét az EON távleolvasási portálról, meg a Solplanet honlapjáról kellett begyűjteni az adatokat.

Az, hogy adatvesztés nem történt, kizárólag a párhuzamos rendszernek volt köszönhető, amikor az egyik rendszer fejreállt, a másikból pótolni lehetett mindent. Sikerült elérni a 0%-os adatvesztést, így az egész évről lett adatom 15 perces bontásban.

## Egy elektromos rendszer működésének megértése

Az elektromos rendszerünk működését a 10 másodperces bontásban tökéletesen megérthetjük.

### Hogyan fogyaszt egy háztartás 10 másodperces bontásban

TBD

Amint a képen látható, a rendszer tüskékben fogyasztja az áramot. Elindítom a mosogatógépet, a vízmelegítő 2000W-ot fogyaszt, viszont a víz keringetéséhez már pár watt elég. A vízforraló is néhány percig 2000W-on megy, majd leáll. Sok elektromos eszköz tüskében fogyaszt, a villanysütő viszont fixen 1000W-on ment nálunk.

### Hogyan termel a napelem 10 másodperces bontásban

TBD

A képen egy bárányfelhős napot látunk. Amikor közvetlen fény süt a napelemre, 4000W-on is termel, amikor egy bárányfelhő mindent eltakar, a szórt fény 1000W körül van.

### Miért nem probléma a tüskés fogyasztás és termelés?

A szolgáltató számára azért nem probléma, mert mindenki máskor indítja el a mosogatógépét, simított fogyasztást látnak tüskék helyett. A bárányfelhőt is másképp látják a különböző helyen lévő és különböző szögben álló napelemek. Minthogy a lakossági napelemes rendszerek teljesen heterogén és nagy területen elszóródó rendszerek, így a szolgáltató csak simított adatokat lát tüskék helyett.

## Az éves termelés kiértékelése

TBD

### Fogyasztás és termelés

TBD

### Heti szaldó

TBD

### Éves szaldó

TBD

### Fogyasztás és termelés heti átlagban

TBD

## Kormányzati megoldások és problémái

### Visszwatt problémái

A 10 másodperces adatokból látszik, hogy a rendszerünk gyakran tüskékben fogyaszt, bár ez a szolgáltatónak nem okoz gondot. Miközben a mosogatógép átlag 300W termelését a napelem teljesen fedezni tudná, a visszwatt védelem levágja amikor többlet termelésünk lenne és kiszámlázza a tüskék miatti többlet fogyasztást. Ilyenkor a semmiért fizetünk, a szolgáltatónak a tüskékből nem adódik többlete. Három fázison mégdurvább a kiesés, mert amennyiben nem egyenletesen terheljük le a három fázist, a megtermelt energia zöme a kukába kerül, bár házon belül felhasználhatnánk normális számlázással.

A mi lakásunk önfogyasztása egy fázison 40% lenne, három fázissal 15%, három fázisú rendszerre a szolgáltató kötelezett.

### Az ipar által javasolt 15 perces szaldó

Sokan felháborodtak ezen, viszont az egyetlen igazságosnak mondható elszámolás, ahol a semmit nem fizettetik meg a lakossággal. Az energiatárolás pénzbe kerül, ki lehet számlázni, de ha nem tárolnak energiát, akkor miért is kellene fizetni? A 15 perces szaldó egy igazságosnak mondható elszámolási rendszer.

### Lehetne-e akkumulátort berakni a tüskék kiegyenlítésére?

Mindig fel kell tenni a kérdést, hogy érdemes-e milliókat fizetni azért, mert a szolgáltató képtelen rendesen számlázni. Nem lehetne-e olcsóbban megoldani a mérőszoftver frissítésével?

### Bruttó elszámolás mérőóra-állás alapján

Az összes elszámolás közül a legnagyobb hülyeség X Ft-ért kiszámlázni az elfogyasztott energiát, Y Ft-ért megvenni a megtermelt energiát. Háromfázisú rendszereknél már tényleg semmi értelme nincs a 15%-os önfelhasználásnak, akár le is lehet kapcsolni az invertert, akkor nem adunk ingyen energiát az államnak.

A leghülyébb megoldás kiválasztásának egyetlen indoka van: a szolgáltatók buta mérőórákat telepítettek sok helyen, sokba kerülne az összes mérőóra cseréje és csak évente akarják leolvasni az adatokat. Ebbe bukott bele a havi szaldó is, nincsenek rendes mérőórák.

Ebből a helyzetből adódott, hogy a szakma által ajánlott 15 perces szaldót elvetették, helyette ad-hoc ötletelésbe kezdtek és mérőóra-állás alapján számláznának, aminek tényleg semmi köze a valósághoz, pénzbehajtásról szól.

## Az éves adatok megtekintése

Ezen az [URL](https://kamutelapo.github.io/napelem)-en megtekinthetők a termelésünk és fogyasztásunk éves adatai webalkalmazásban.
