FASTAPI_DIR = api-python
NESTJS_DIR = api-nestjs
NEXTJS_DIR = front

.PHONY: install

install:
	@echo "📦 Instalando dependencias en todos los proyectos..."
	@$(MAKE) -C $(FASTAPI_DIR) install
	@$(MAKE) -C $(NESTJS_DIR) install
	@$(MAKE) -C $(NEXTJS_DIR) install
	@echo "✅ Instalación completada en todos los proyectos."
