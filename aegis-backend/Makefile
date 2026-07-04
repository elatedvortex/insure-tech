##
## Aegis Backend — Developer Makefile
##

VENV ?= .venv
PYTHON = $(VENV)/bin/python
PIP = $(VENV)/bin/pip
UV = uv  # falls back gracefully if not installed

.PHONY: install dev migrate migrate-auto test lint

## Create venv and install dependencies
install:
	python3 -m venv $(VENV)
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

## Run the dev server (hot-reload)
dev:
	$(VENV)/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000

## Apply existing migrations
migrate:
	$(VENV)/bin/alembic upgrade head

## Generate a new auto-migration (usage: make migrate-auto msg="add xyz")
migrate-auto:
	$(VENV)/bin/alembic revision --autogenerate -m "$(msg)"

## Run tests
test:
	$(VENV)/bin/pytest -v

## Lint / format
lint:
	$(VENV)/bin/ruff check . --fix
	$(VENV)/bin/ruff format .
