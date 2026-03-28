#!/bin/bash
# 批量下载意大利语音频 (Google TTS)
# 输出到 italian-miniapp/audio/ 目录

OUTPUT_DIR="$(dirname "$0")/../audio"
mkdir -p "$OUTPUT_DIR"

# 所有意大利语词条
declare -A PHRASES=(
  # 问候
  [0]="Ciao"
  [1]="Buongiorno"
  [2]="Buonasera"
  [3]="Grazie"
  [4]="Grazie mille"
  [5]="Prego"
  [6]="Scusa"
  [7]="Mi dispiace"
  [8]="Sì"
  [9]="No"
  [10]="Come stai?"
  [11]="Bene, grazie!"
  [12]="Parla cinese?"
  [13]="Parla inglese?"
  [14]="Non capisco"
  [15]="Può ripetere?"
  # 餐厅
  [16]="Un tavolo per due"
  [17]="Il menu"
  [18]="Cosa mi consiglia?"
  [19]="Vorrei"
  [20]="Per me una pizza"
  [21]="Il conto"
  [22]="Cameriere"
  [23]="Sono allergico a"
  [24]="Sono vegetariano"
  [25]="Senza glutine"
  [26]="Acqua naturale o frizzante?"
  [27]="Un caffè"
  [28]="È delizioso!"
  [29]="Posso pagare con carta?"
  [30]="Posso avere la ricevuta?"
  [31]="Che cosa è questo?"
  [32]="Buon appetito!"
  [33]="Mezzo litro di vino rosso"
  # 问路
  [34]="Dov'è?"
  [35]="Come arrivo a?"
  [36]="Dov'è la stazione?"
  [37]="Dov'è il bagno?"
  [38]="Giri a destra"
  [39]="Giri a sinistra"
  [40]="Vada dritto"
  [41]="Un biglietto per"
  [42]="A che ora parte il treno?"
  [43]="Fermata del metro"
  [44]="Aeroporto"
  [45]="Mi può chiamare un taxi?"
  [46]="Vada a questo indirizzo"
  [47]="Quanto costa?"
  [48]="Mi sono perso"
  # 购物
  [49]="Quanto costa questo?"
  [50]="È troppo caro"
  [51]="Ha uno sconto?"
  [52]="Posso provarlo?"
  [53]="Che taglia è?"
  [54]="Avete una taglia più grande?"
  [55]="Più piccola?"
  [56]="Lo prendo"
  [57]="Posso pagare con carta?"
  [58]="Dov'è la cassa?"
  [59]="Vorrei restituire questo"
  [60]="Avete questo in un altro colore?"
  [61]="Mi può fare uno scontrino?"
  [62]="È in saldo?"
  # 住宿
  [63]="Ho una prenotazione"
  [64]="Vorrei fare il check-in"
  [65]="A che ora è il check-out?"
  [66]="Camera singola"
  [67]="Camera doppia"
  [68]="La colazione è inclusa?"
  [69]="C'è il Wi-Fi?"
  [70]="La camera è troppo fredda"
  [71]="Vorrei più asciugamani"
  [72]="La chiave"
  [73]="Vorrei fare il check-out"
  [74]="C'è un parcheggio?"
  [75]="Mi svegli alle"
  [76]="Il bagno non funziona"
  # 紧急
  [77]="Aiuto!"
  [78]="Chiami la polizia!"
  [79]="Chiami un'ambulanza!"
  [80]="Ho bisogno di un medico"
  [81]="Dov'è l'ospedale?"
  [82]="Farmacia"
  [83]="Mi hanno rubato il portafoglio"
  [84]="Ho perso il passaporto"
  [85]="Non mi sento bene"
  [86]="Mi fa male qui"
  # 数字与时间
  [87]="Uno, due, tre"
  [88]="Quattro, cinque, sei"
  [89]="Sette, otto, nove, dieci"
  [90]="Venti, trenta, cinquanta, cento"
  [91]="Cento, mille"
  [92]="Che ore sono?"
  [93]="Sono le tre"
  [94]="Lunedì, martedì, mercoledì"
  [95]="Giovedì, venerdì, sabato, domenica"
  [96]="Oggi, domani, ieri"
  [97]="Mattina, pomeriggio, sera"
  [98]="Quanto tempo ci vuole?"
  [99]="Tra dieci minuti"
  [100]="Per favore"
  [101]="Destra, sinistra, dritto"
  # EXTRA
  [200]="Arrivederci"
  [201]="Buonanotte"
  [202]="Come ti chiami?"
  [203]="Mi chiamo"
  [204]="Piacere"
  [205]="Antipasto"
  [206]="Primo piatto"
  [207]="Secondo piatto"
  [208]="Dolce"
  [209]="Vino della casa"
  [210]="Museo"
  [211]="Centro storico"
  [212]="Piazza"
  [213]="Via"
  [214]="Mercato"
  [215]="Prezzo"
  [216]="Ascensore"
  [217]="Piano terra"
  [218]="Pronto soccorso"
  [219]="Oggi è lunedì"
  [220]="In bocca al lupo!"
  [221]="Coperto"
  [222]="Semaforo"
  [223]="Boutique"
  [224]="Colazione"
  [225]="Ospedale"
  [226]="Settimana"
  [227]="Mese"
  [228]="Come va?"
  [229]="Brioche"
  [230]="Fontana"
  [231]="Scontrino"
  [232]="Portiere"
  [233]="Dentista"
  [234]="Anno"
  [235]="Giorno"
  [236]="Ora"
  [237]="Minuto"
  [238]="Benvenuto"
  [239]="Tavola calda"
  [240]="Autobus"
  [241]="Taglia"
  [242]="Aria condizionata"
  [243]="Allergia"
  [244]="Mezzogiorno"
  [245]="Mezzanotte"
  [246]="Salve"
  [247]="Gelato"
  [248]="Taxi"
  [249]="Supermercato"
)

SUCCESS=0
FAIL=0
SKIP=0
TOTAL=${#PHRASES[@]}

echo "🎵 开始下载意大利语音频，共 $TOTAL 条..."
echo ""

for id in $(echo "${!PHRASES[@]}" | tr ' ' '\n' | sort -n); do
  text="${PHRASES[$id]}"
  filename="${OUTPUT_DIR}/${id}.mp3"

  if [ -f "$filename" ]; then
    echo "⏭️  [$id] 已存在，跳过"
    ((SKIP++))
    continue
  fi

  # URL encode
  encoded=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$text'))" 2>/dev/null)
  url="https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=it&client=gtx&ttsspeed=0.8"

  http_code=$(curl -s -o "$filename" -w "%{http_code}" \
    -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    "$url")

  if [ "$http_code" = "200" ] && [ -s "$filename" ]; then
    echo "✅ [$id] $text"
    ((SUCCESS++))
  else
    echo "❌ [$id] $text (HTTP $http_code)"
    rm -f "$filename"
    ((FAIL++))
  fi

  # 避免被限速，每条间隔 0.3s
  sleep 0.3
done

echo ""
echo "========================================="
echo "✅ 成功: $SUCCESS  ❌ 失败: $FAIL  ⏭️ 跳过: $SKIP"
echo "音频保存在: $OUTPUT_DIR"
