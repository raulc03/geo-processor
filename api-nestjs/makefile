.PHONY: install run test clean

install:
	npm install
	nest build

run:
	npm run start:prod

test:
	npm test

clean:
	rm -rf node_modules
	rm -rf dist
	npm cache clean --force
