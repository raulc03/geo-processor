APP_PATH = src/api_python/main.py
TEST_PATH = test

.PHONY: install run test

install:
	uv sync

run:
	uv run fastapi run $(APP_PATH)

test:
	uv run pytest $(TEST_PATH)
