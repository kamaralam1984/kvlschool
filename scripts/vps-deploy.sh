#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# KVL School System — Safe VPS Deployment (Fixed)
# Run as root on Hostinger VPS (187.127.148.237)
# SAFE: Does NOT touch existing sites
# ═══════════════════════════════════════════════════════════════
set -e

REPO="https://github.com/kamaralam1984/kvlschool.git"
APP_DIR="/var/www/kvlschool"
DOMAIN="school.kvlbusinesssolutions.com"
NEXT_BIN="$APP_DIR/node_modules/.bin/next"

PORT_API=4200
PORT_WEB=3200
PORT_ADMIN=3201
PORT_STUDENT=3202
PORT_PARENT=3203
PORT_TEACHER=3204
PORT_MONGO=27020
PORT_PG=5440
PORT_REDIS=6385

echo "════════════════════════════════════════"
echo " KVL School — Deployment Starting"
echo "════════════════════════════════════════"

# ─── 1. Node.js check ────────────────────────────────────────
npm install -g pm2 2>/dev/null || true
echo "[1] Node $(node -v) ✓"

# ─── 2. Clone / update repo ──────────────────────────────────
echo "[2] Setting up repository..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull origin main
else
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"
echo "[2] Repo ready ✓"

# ─── 3. Start databases ──────────────────────────────────────
echo "[3] Starting databases..."
cat > "$APP_DIR/docker-compose.kvl.yml" << COMPOSE
services:
  kvl-mongodb:
    image: mongo:7
    container_name: kvl-mongodb
    restart: unless-stopped
    ports:
      - "127.0.0.1:${PORT_MONGO}:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: school_admin
      MONGO_INITDB_ROOT_PASSWORD: school_password
      MONGO_INITDB_DATABASE: school_ecosystem
    volumes:
      - kvl_mongo_data:/data/db

  kvl-postgres:
    image: postgres:16-alpine
    container_name: kvl-postgres
    restart: unless-stopped
    ports:
      - "127.0.0.1:${PORT_PG}:5432"
    environment:
      POSTGRES_DB: school_ecosystem
      POSTGRES_USER: school_admin
      POSTGRES_PASSWORD: school_password
    volumes:
      - kvl_pg_data:/var/lib/postgresql/data

  kvl-redis:
    image: redis:7-alpine
    container_name: kvl-redis
    restart: unless-stopped
    ports:
      - "127.0.0.1:${PORT_REDIS}:6379"
    command: redis-server --requirepass school_redis_pass
    volumes:
      - kvl_redis_data:/data

volumes:
  kvl_mongo_data:
  kvl_pg_data:
  kvl_redis_data:
COMPOSE

docker compose -f docker-compose.kvl.yml up -d
sleep 15
echo "[3] Databases started ✓"

# ─── 4. Create .env ──────────────────────────────────────────
echo "[4] Creating .env..."
cat > "$APP_DIR/apps/api/.env" << ENV
NODE_ENV=production
PORT=${PORT_API}
APP_NAME=KVL International School

MONGODB_URI=mongodb://school_admin:school_password@127.0.0.1:${PORT_MONGO}/school_ecosystem?authSource=admin
DATABASE_URL=postgresql://school_admin:school_password@127.0.0.1:${PORT_PG}/school_ecosystem
REDIS_URL=redis://:school_redis_pass@127.0.0.1:${PORT_REDIS}

JWT_SECRET=kvl_jwt_$(openssl rand -hex 32)
JWT_REFRESH_SECRET=kvl_refresh_$(openssl rand -hex 32)
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12

CORS_ORIGINS=https://${DOMAIN}
APP_URL=https://${DOMAIN}
API_URL=https://${DOMAIN}/api/v1

SCHOOL_NAME=KVL International School
SCHOOL_CODE=KVL-MH-001
SCHOOL_BOARD=CBSE
CURRENT_ACADEMIC_YEAR=2025-26
LOG_LEVEL=warn
ENV

for app in web admin student parent teacher; do
  cat > "$APP_DIR/apps/$app/.env.production" << ENV
NEXT_PUBLIC_API_URL=https://${DOMAIN}
NEXT_PUBLIC_APP_NAME=KVL International School
ENV
done
echo "[4] Environment configured ✓"

# ─── 5. Install dependencies ─────────────────────────────────
echo "[5] Installing dependencies..."
cd "$APP_DIR"
npm install --legacy-peer-deps 2>/dev/null || npm install
echo "[5] Dependencies installed ✓"

# ─── 6. Build API ────────────────────────────────────────────
echo "[6] Building API..."
cd "$APP_DIR/apps/api"
npm install 2>/dev/null || true
npm run build
npx prisma migrate deploy 2>/dev/null || true
npx ts-node --transpile-only -r tsconfig-paths/register scripts/seed-users.ts 2>/dev/null || true
echo "[6] API built ✓"

# ─── 7. Build Next.js apps ───────────────────────────────────
echo "[7] Building frontend apps..."
for app in web admin student parent teacher; do
  echo "  Building $app..."
  cd "$APP_DIR/apps/$app"
  npm install 2>/dev/null || true
  NODE_ENV=production NEXT_PUBLIC_API_URL="https://${DOMAIN}" npm run build
  echo "  ✓ $app done"
done
echo "[7] All apps built ✓"

# ─── 8. Start with PM2 ───────────────────────────────────────
echo "[8] Starting with PM2..."
cd "$APP_DIR"
pm2 delete kvl-api kvl-web kvl-admin kvl-student kvl-parent kvl-teacher 2>/dev/null || true

# API (from its own directory so .env is found)
pm2 start "node dist/main.js" --name "kvl-api" --cwd "$APP_DIR/apps/api"

# Next.js apps using root node_modules next binary
pm2 start "$NEXT_BIN start -p $PORT_WEB"     --name "kvl-web"     --cwd "$APP_DIR/apps/web"
pm2 start "$NEXT_BIN start -p $PORT_ADMIN"   --name "kvl-admin"   --cwd "$APP_DIR/apps/admin"
pm2 start "$NEXT_BIN start -p $PORT_STUDENT" --name "kvl-student" --cwd "$APP_DIR/apps/student"
pm2 start "$NEXT_BIN start -p $PORT_PARENT"  --name "kvl-parent"  --cwd "$APP_DIR/apps/parent"
pm2 start "$NEXT_BIN start -p $PORT_TEACHER" --name "kvl-teacher" --cwd "$APP_DIR/apps/teacher"

pm2 save
pm2 startup 2>/dev/null || true
echo "[8] PM2 apps started ✓"

# ─── 9. Nginx config ─────────────────────────────────────────
echo "[9] Configuring Nginx..."
cp "$APP_DIR/docker/nginx/school.conf" /etc/nginx/sites-available/kvl-school
ln -sf /etc/nginx/sites-available/kvl-school /etc/nginx/sites-enabled/kvl-school
nginx -t && systemctl reload nginx
echo "[9] Nginx configured ✓"

# ─── 10. SSL ─────────────────────────────────────────────────
if ! [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
  echo "[10] Getting SSL certificate..."
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos \
    -m admin@kvlbusinesssolutions.com --redirect
  echo "[10] SSL done ✓"
else
  echo "[10] SSL already exists ✓"
fi

echo ""
echo "════════════════════════════════════════"
echo " DEPLOYMENT COMPLETE!"
echo " https://${DOMAIN}          → Public Website"
echo " https://${DOMAIN}/admin    → Admin Panel"
echo " https://${DOMAIN}/student  → Student Portal"
echo " https://${DOMAIN}/parent   → Parent Portal"
echo " https://${DOMAIN}/teacher  → Teacher Portal"
echo " https://${DOMAIN}/api/v1/health → API"
echo ""
echo " Login: superadmin@kvlschool.com / Admin@123456"
echo "════════════════════════════════════════"
pm2 list
