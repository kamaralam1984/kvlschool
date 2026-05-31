# ============================================================
# KVL International School — Project Makefile
# ============================================================
# Usage: make <target>
# ============================================================

.PHONY: help dev dev-infra prod down clean logs seed build

# Default
help:
	@echo ""
	@echo "KVL International School — Available commands:"
	@echo ""
	@echo "  Development:"
	@echo "  make dev-infra   Start only DB/Redis (for local dev)"
	@echo "  make dev         Start infrastructure + all apps"
	@echo "  make seed        Seed database with sample data"
	@echo ""
	@echo "  Production:"
	@echo "  make build       Build all Docker images"
	@echo "  make prod        Start all services in production mode"
	@echo "  make down        Stop all services"
	@echo ""
	@echo "  Utilities:"
	@echo "  make logs        Tail all container logs"
	@echo "  make logs-api    Tail API logs only"
	@echo "  make clean       Remove containers and volumes"
	@echo "  make ps          Show running containers"
	@echo "  make shell-api   Open shell in API container"
	@echo "  make shell-db    Open MongoDB shell"
	@echo ""

# ─── Development ─────────────────────────────────────────────
dev-infra:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ Infrastructure ready:"
	@echo "   MongoDB:       localhost:27017"
	@echo "   PostgreSQL:    localhost:5432"
	@echo "   Redis:         localhost:6379"
	@echo "   Mongo Express: http://localhost:8082"
	@echo "   pgAdmin:       http://localhost:8083"
	@echo "   Redis UI:      http://localhost:8081"
	@echo "   Mailhog UI:    http://localhost:8025"
	@echo ""
	@echo "▶  Now run: npm run dev"

dev: dev-infra
	npm run dev

# ─── Production ──────────────────────────────────────────────
build:
	docker-compose build --parallel

prod:
	docker-compose up -d
	@echo "✅ Production stack running:"
	@echo "   Public Site:    http://localhost:3000"
	@echo "   Admin Panel:    http://localhost:3001"
	@echo "   Student Portal: http://localhost:3002"
	@echo "   Parent Portal:  http://localhost:3003"
	@echo "   Teacher Portal: http://localhost:3004"
	@echo "   API:            http://localhost:4000"
	@echo "   Health Check:   http://localhost:4000/health"

down:
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

# ─── Logs ────────────────────────────────────────────────────
logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-web:
	docker-compose logs -f web

logs-nginx:
	docker-compose logs -f nginx

# ─── Utilities ───────────────────────────────────────────────
ps:
	docker-compose ps

shell-api:
	docker-compose exec api sh

shell-db:
	docker-compose exec mongodb mongosh -u school_admin -p school_password --authenticationDatabase admin school_ecosystem

shell-redis:
	docker-compose exec redis redis-cli -a school_redis_pass

seed:
	cd apps/api && npm run db:seed

migrate:
	cd apps/api && npm run db:migrate

# ─── Clean ───────────────────────────────────────────────────
clean:
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	@echo "✅ All containers and volumes removed"

clean-images:
	docker-compose down --rmi local -v --remove-orphans

# ─── SSL (Let's Encrypt) ─────────────────────────────────────
ssl-init:
	@echo "Run certbot to generate SSL certificates:"
	@echo "certbot certonly --webroot -w ./docker/webroot \\"
	@echo "  -d kvlschool.edu.in -d www.kvlschool.edu.in \\"
	@echo "  -d admin.kvlschool.edu.in -d api.kvlschool.edu.in \\"
	@echo "  -d student.kvlschool.edu.in -d parent.kvlschool.edu.in \\"
	@echo "  -d teacher.kvlschool.edu.in"
