.PHONY: start stop down restart

start:
	docker compose up --build -d

stop:
	docker compose stop

down:
	docker compose down -v

restart: down start
