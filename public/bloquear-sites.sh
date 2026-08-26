#!/bin/bash
# ============================================================
# Bloqueio de sites para crianças - Debian/Ubuntu
# Funciona no Chrome, Firefox e qualquer navegador,
# pois bloqueia no nível do sistema (/etc/hosts).
#
# USO:
#   sudo ./bloquear-sites.sh          -> ativa o bloqueio
#   sudo ./bloquear-sites.sh remover  -> remove o bloqueio
# ============================================================

HOSTS="/etc/hosts"
MARCA_INICIO="# >>> BLOQUEIO-CRIANCAS INICIO >>>"
MARCA_FIM="# <<< BLOQUEIO-CRIANCAS FIM <<<"

# Verifica se está rodando como root
if [ "$EUID" -ne 0 ]; then
  echo "Erro: execute com sudo. Ex.: sudo ./bloquear-sites.sh"
  exit 1
fi

# Lista de domínios bloqueados (adicione ou remova conforme quiser)
DOMINIOS=(
  # --- Jogos online ---
  poki.com
  poki.com.br
  www.poki.com
  www.poki.com.br
  friv.com
  www.friv.com
  crazygames.com
  www.crazygames.com
  crazygames.com.br
  y8.com
  www.y8.com
  kizi.com
  www.kizi.com
  clickjogos.com.br
  www.clickjogos.com.br
  jogos360.com.br
  www.jogos360.com.br
  ojogos.com.br
  www.ojogos.com.br
  gamesgames.com
  www.gamesgames.com
  agame.com
  www.agame.com
  miniclip.com
  www.miniclip.com
  coolmathgames.com
  www.coolmathgames.com

  # --- Roblox ---
  roblox.com
  www.roblox.com
  web.roblox.com
  apis.roblox.com
  auth.roblox.com
  gamejoin.roblox.com
  assetdelivery.roblox.com
  rbxcdn.com
  www.rbxcdn.com

  # --- YouTube ---
  youtube.com
  www.youtube.com
  m.youtube.com
  music.youtube.com
  youtu.be
  www.youtu.be
  youtube-nocookie.com
  www.youtube-nocookie.com
  youtubekids.com
  www.youtubekids.com

  # --- Netflix ---
  netflix.com
  www.netflix.com
  nflxvideo.net
  nflximg.net
  nflxext.com

  # --- Apostas / cassino (principais no Brasil) ---
  bet365.com
  www.bet365.com
  bet365.bet.br
  betano.com
  www.betano.com
  betano.bet.br
  blaze.com
  www.blaze.com
  blaze.bet.br
  sportingbet.com
  www.sportingbet.com
  sportingbet.bet.br
  betfair.com
  www.betfair.com
  pixbet.com
  www.pixbet.com
  pixbet.bet.br
  esportesdasorte.com
  www.esportesdasorte.com
  esportesdasorte.bet.br
  estrelabet.com
  www.estrelabet.com
  estrelabet.bet.br
  superbet.com
  www.superbet.com
  superbet.bet.br
  kto.com
  www.kto.com
  kto.bet.br
  betnacional.com
  www.betnacional.com
  betnacional.bet.br
  stake.com
  www.stake.com
  stake.bet.br
  f12.bet
  www.f12.bet
  vaidebet.com
  www.vaidebet.com
  seubet.com
  www.seubet.com
  novibet.com
  www.novibet.com
  betway.com
  www.betway.com
  leovegas.com
  www.leovegas.com
  jogodobicho.net
  www.jogodobicho.net
)

remover_bloqueio() {
  if grep -q "$MARCA_INICIO" "$HOSTS"; then
    sed -i "/$MARCA_INICIO/,/$MARCA_FIM/d" "$HOSTS"
    echo "Bloqueio removido com sucesso."
  else
    echo "Nenhum bloqueio encontrado no $HOSTS."
  fi
}

aplicar_bloqueio() {
  # Remove bloqueio antigo antes (evita duplicar)
  if grep -q "$MARCA_INICIO" "$HOSTS"; then
    sed -i "/$MARCA_INICIO/,/$MARCA_FIM/d" "$HOSTS"
  fi

  # Backup do arquivo original
  cp "$HOSTS" "${HOSTS}.backup-$(date +%Y%m%d-%H%M%S)"

  {
    echo "$MARCA_INICIO"
    for dominio in "${DOMINIOS[@]}"; do
      echo "0.0.0.0 $dominio"
      echo ":: $dominio"
    done
    echo "$MARCA_FIM"
  } >> "$HOSTS"

  echo "Bloqueio aplicado! ${#DOMINIOS[@]} domínios bloqueados."
  echo "Backup salvo em ${HOSTS}.backup-*"
}

# ------------------------------------------------------------
# Página inicial do Chrome/Chromium (política gerenciada)
# O usuário NÃO consegue mudar pelas configurações do navegador.
# ------------------------------------------------------------
PAGINA_INICIAL="https://edu.thep.com.br"
POLICY_DIRS=(
  "/etc/opt/chrome/policies/managed"      # Google Chrome
  "/etc/chromium/policies/managed"        # Chromium (Debian)
  "/etc/chromium-browser/policies/managed" # Chromium (Ubuntu antigo)
)
POLICY_FILE="pagina-inicial-criancas.json"

aplicar_pagina_inicial() {
  # Monta a lista de bloqueio do Chrome a partir dos domínios
  # (na política do Chrome, "site.com" já bloqueia subdomínios também)
  BLOCKLIST=""
  for dominio in "${DOMINIOS[@]}"; do
    # pula entradas www. (o domínio base já cobre)
    case "$dominio" in www.*) continue ;; esac
    if [ -n "$BLOCKLIST" ]; then
      BLOCKLIST="$BLOCKLIST, \"$dominio\""
    else
      BLOCKLIST="\"$dominio\""
    fi
  done

  for dir in "${POLICY_DIRS[@]}"; do
    mkdir -p "$dir"
    cat > "$dir/$POLICY_FILE" <<EOF
{
  "HomepageLocation": "$PAGINA_INICIAL",
  "HomepageIsNewTabPage": false,
  "ShowHomeButton": true,
  "RestoreOnStartup": 4,
  "RestoreOnStartupURLs": ["$PAGINA_INICIAL"],
  "DnsOverHttpsMode": "off",
  "BuiltInDnsClientEnabled": false,
  "URLBlocklist": [$BLOCKLIST]
}
EOF
  done
  echo "Página inicial do Chrome definida como: $PAGINA_INICIAL"
  echo "Bloqueio duplo ativado (hosts + política do Chrome)."
}

remover_pagina_inicial() {
  for dir in "${POLICY_DIRS[@]}"; do
    rm -f "$dir/$POLICY_FILE"
  done
  echo "Política de página inicial removida."
}

limpar_cache() {
  # Limpa cache DNS se o systemd-resolved estiver ativo
  if command -v resolvectl >/dev/null 2>&1; then
    resolvectl flush-caches 2>/dev/null
  fi
  echo ""
  echo "IMPORTANTE: feche TODAS as janelas do Chrome e abra de novo,"
  echo "pois o navegador guarda cache de DNS próprio."
  echo "Se ainda abrir algum site, digite chrome://net-internals/#dns"
  echo "no Chrome e clique em 'Clear host cache'."
}

if [ "$1" == "remover" ]; then
  remover_bloqueio
  remover_pagina_inicial
  limpar_cache
else
  aplicar_bloqueio
  aplicar_pagina_inicial
  limpar_cache
fi
