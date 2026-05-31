#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# KVL School System — Safe VPS Deployment
# Run as root on Hostinger VPS (187.127.148.237)
# SAFE: Does NOT touch existing sites (vidyt, aapkaplot, 8rupiya, kvl-business)
# ═══════════════════════════════════════════════════════════════
set -e

REPO="https://github.com/kamaralam1984/kvlschool.git"
APP_DIR="/var/www/kvlschool"
DOMAIN="school.kvlbusinesssolutions.com"

# Safe ports (no conflict with existing apps)
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
echo " KVL School — Safe Deployment Starting"
echo "════════════════════════════════════════"

# ─── 1. Install Node.js 20 if not present ────────────────────
if ! node --version 2>/dev/null | grep -q "v20"; then
  echo "[1] Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - -qq
  apt-get install -y nodejs -qq
fi
npm install -g pm2 2>/dev/null || true
echo "[1] Node $(node -v) ✓"

# ─── 2. Clone / update repo ───────────────────────────────────
echo "[2] Setting up repository..."
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull origin main
else
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi
echo "[2] Repo ready ✓"

# ─── 3. Start KVL databases via Docker ───────────────────────
echo "[3] Starting KVL databases..."
cd "$APP_DIR"

cat > docker-compose.kvl.yml << EOF
version: '3.8'
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
EOF

docker compose -f docker-compose.kvl.yml up -d
echo "Waiting for databases..."
sleep 15
echo "[3] Databases started ✓"

# ─── 4. Create production .env ────────────────────────────────
echo "[4] Creating .env..."
cat > "$APP_DIR/apps/api/.env" << EOF
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

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@kvlschool.edu.in
SMTP_PASS=your_gmail_app_password

LOG_LEVEL=warn
EOF

# Frontend env for all apps
for app in web admin student parent teacher; do
  cat > "$APP_DIR/apps/$app/.env.production" << EOF
NEXT_PUBLIC_API_URL=https://${DOMAIN}
NEXT_PUBLIC_APP_NAME=KVL International School
EOF
done
echo "[4] Environment configured ✓"

# ─── 5. Install dependencies ──────────────────────────────────
echo "[5] Installing dependencies..."
cd "$APP_DIR"
npm install --legacy-peer-deps 2>/dev/null || npm install
echo "[5] Dependencies installed ✓"

# ─── 6. Build API ─────────────────────────────────────────────
echo "[6] Building API..."
cd "$APP_DIR/apps/api"
npm install 2>/dev/null || true
npm run build
# Run migrations and seed
npx prisma migrate deploy 2>/dev/null || true
npx ts-node -r tsconfig-paths/register scripts/seed-users.ts 2>/dev/null || true
echo "[6] API built ✓"

# ─── 7. Build Next.js apps ────────────────────────────────────
echo "[7] Building frontend apps (this takes 5-10 min)..."
for app in web admin student parent teacher; do
  echo "  Building $app..."
  cd "$APP_DIR/apps/$app"
  npm install 2>/dev/null || true
  PORT_VAR="PORT_${app^^}"
  # Set PORT env for each app
  case $app in
    web)     APPPORT=$PORT_WEB ;;
    admin)   APPPORT=$PORT_ADMIN ;;
    student) APPPORT=$PORT_STUDENT ;;
    parent)  APPPORT=$PORT_PARENT ;;
    teacher) APPPORT=$PORT_TEACHER ;;
  esac
  NEXT_PUBLIC_API_URL="https://${DOMAIN}" npm run build
  echo "  ✓ $app done"
done
echo "[7] All apps built ✓"

# ─── 8. Start with PM2 ────────────────────────────────────────
echo "[8] Starting apps with PM2..."
cd "$APP_DIR"

# Stop old KVL processes if any
pm2 delete kvl-api kvl-web kvl-admin kvl-student kvl-parent kvl-teacher 2>/dev/null || true

# Start API
pm2 start "node apps/api/dist/main.js" \
  --name "kvl-api" --cwd "$APP_DIR" \
  --env production

# Start Next.js apps
for app in web admin student parent teacher; do
  case $app in
    web)     APPPORT=$PORT_WEB ;;
    admin)   APPPORT=$PORT_ADMIN ;;
    student) APPPORT=$PORT_STUDENT ;;
    parent)  APPPORT=$PORT_PARENT ;;
    teacher) APPPORT=$PORT_TEACHER ;;
  esac
  pm2 start "node apps/$app/.next/standalone/server.js" \
    --name "kvl-$app" --cwd "$APP_DIR" \
    --env production \
    -- --port $APPPORT
done

pm2 save
echo "[8] PM2 apps started ✓"

# ─── 9. Nginx config (NEW — does NOT touch existing) ─────────
echo "[9] Adding Nginx config for $DOMAIN..."

cat > /etc/nginx/sites-available/kvl-school << EOF
# KVL School — school.kvlbusinesssolutions.com
# Does NOT affect: vidyt.com, aapkaplot.com, 8rupiya.in, kvlbusinesssolutions.com

server {
    listen 80;
    server_name ${DOMAIN};

    client_max_body_size 50M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # API
    location /api/ {
        proxy_pass         http://127.0.0.1:${PORT_API};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass         http://127.0.0.1:${PORT_API};
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
    }

    # Admin Panel
    location /admin {
        proxy_pass         http://127.0.0.1:${PORT_ADMIN};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    # Student Portal
    location /student {
        proxy_pass         http://127.0.0.1:${PORT_STUDENT};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    # Parent Portal
    location /parent {
        proxy_pass         http://127.0.0.1:${PORT_PARENT};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    # Teacher Portal
    location /teacher {
        proxy_pass         http://127.0.0.1:${PORT_TEACHER};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }

    # Public Website (default)
    location / {
        proxy_pass         http://127.0.0.1:${PORT_WEB};
        proxy_http_version 1.1;
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/kvl-school /etc/nginx/sites-enabled/kvl-school
nginx -t && systemctl reload nginx
echo "[9] Nginx configured ✓"

# ─── 10. SSL Certificate ─────────────────────────────────────
echo "[10] Getting SSL certificate..."
certbot --nginx -d "$DOMAIN" \
  --non-interactive --agree-tos \
  -m admin@kvlbusinesssolutions.com \
  --redirect
echo "[10] SSL done ✓"

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
echo ""
echo " Existing sites STATUS:"
pm2 list
