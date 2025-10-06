FASTAPI_DIR = api-python
NESTJS_DIR = api-nestjs
NEXTJS_DIR = front

.PHONY: install run stop

install:
	@echo "📦 Instalando dependencias en todos los proyectos..."
	@$(MAKE) -C $(FASTAPI_DIR) install
	@$(MAKE) -C $(NESTJS_DIR) install
	@$(MAKE) -C $(NEXTJS_DIR) install
	@echo "✅ Instalación completada en todos los proyectos."

run:
	@echo "🚀 Iniciando todos los servidores..."
	@$(MAKE) -C $(FASTAPI_DIR) run &
	@FASTAPI_PID=$$!; echo $$FASTAPI_PID > .fastapi.pid
	@$(MAKE) -C $(NESTJS_DIR) run &
	@NEST_PID=$$!; echo $$NEST_PID > .nestjs.pid
	@$(MAKE) -C $(NEXTJS_DIR) run &
	@NEXT_PID=$$!; echo $$NEXT_PID > .nextjs.pid
	@echo "✅ Todos los servidores fueron iniciados."
	@wait

stop:
	@echo "🛑 Deteniendo todos los servidores..."
	@-kill $$(cat .fastapi.pid 2>/dev/null) 2>/dev/null || true
	@-kill $$(cat .nestjs.pid 2>/dev/null) 2>/dev/null || true
	@-kill $$(cat .nextjs.pid 2>/dev/null) 2>/dev/null || true
	@rm -f .fastapi.pid .nestjs.pid .nextjs.pid
	@echo "✅ Todos los servidores fueron detenidos."
