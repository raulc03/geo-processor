APP_PATH = src/api_python/main.py
TEST_PATH = test

.PHONY: install run test

install:
	@echo "🔧 Instalando dependencias..."
	uv sync

run:
	@echo "🚀 Levantando el servidor FastAPI..."
	uv run fastapi run $(APP_PATH)

test:
	@echo "🧪 Ejecutando pruebas..."
	uv run pytest $(TEST_PATH)
