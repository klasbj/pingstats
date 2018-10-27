.PHONY: build
build:
	PUBLIC_URL=/pingstats yarn build

.PHONY: deploy
deploy: build
	rsync -rP --exclude=stats.json build/* darkc:/srv/http/pingstats
