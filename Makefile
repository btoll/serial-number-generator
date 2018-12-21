     CC = node
    SNG = corelyticsbftapi.azurewebsites.net
 CONFIG = ./client/components/config.js
DEVPORT = 3001
 SERVER = ./server/app.js

.PHONY: clean dev prod start-server start-ui serve

clean:
	rm -rf sng.zip dist/

dev:
	@sed -i 's/https:/http:/' $(CONFIG)
	@sed -i 's/$(SNG)/localhost/' $(CONFIG)
	@sed -i 's/443/$(DEVPORT)/' $(CONFIG)
	@echo "[make] Changed endpoint socket -> http://localhost:$(DEVPORT)"

prod:
	@sed -i 's/http:/https:/' $(CONFIG)
	@sed -i 's/localhost/$(SNG)/' $(CONFIG)
	@sed -i 's/$(DEVPORT)/443/' $(CONFIG)
	@echo "[make] Changed endpoint socket -> https://$(SNG):443"
	@./node_modules/.bin/webpack
	@echo "[make] Created index.html and serial_number_generator.js in dist/"
	@zip -r sng.zip dist/
	@echo "[make] Created sng.zip archive"

start-server:
	$(CC) $(SERVER)

start-ui:
	./node_modules/.bin/webpack-dev-server --open

serve: start-server start-ui
	mkdir experiments/ &> /dev/null

