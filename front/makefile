.PHONY: install build run clean

install:
	@echo "📦 Instalando dependencias para..."
	npm install
	@echo "🏗️ Compilando..."
	npm run build

run:
	@echo "🚀 Iniciando en modo producción..."
	npm run start

clean:
	@echo "🧹 Limpiando módulos y caché..."
	rm -rf node_modules
	rm -rf .next
	npm cache clean --force
