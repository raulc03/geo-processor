.PHONY: install run test clean

install:
	@echo "📦 Instalando dependencias..."
	npm install
	nest build

run:
	@echo "🚀 Iniciando en modo producción..."
	npm run start:prod

test:
	@echo "🧪 Ejecutando pruebas..."
	npm test

clean:
	@echo "🧹 Limpiando módulos y caché..."
	rm -rf node_modules
	rm -rf dist
	npm cache clean --force
