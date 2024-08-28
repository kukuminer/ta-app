all: pull start attach
start:
	tmux has -t ta-app || tmux \
		new-session -d -s ta-app "$(MAKE) start-client" \; \
		split-window -h          "$(MAKE) start-server" \; \
		split-window -h          "$(MAKE) psql" \; \
		select-layout even-horizontal
start-client:
	while sleep 1; do $(MAKE) -C client start ; done
build-client:
	$(MAKE) -C client build
start-server:
	$(MAKE) -C server start

start-db:
	cd ../pg && bin/pg_ctl -D data/ -l pg.log start
backup-db:
	echo $(PATH) > $(HOME)/path.txt
	mkdir -p ../pg/backups/$(shell date +'%Y')
	cd ../pg && bin/pg_dump taapp -U taapp > backups/$(shell date +'%Y/%Y%m%d%H%M%S').sql

attach:
	tmux attach -t ta-app

psql:
	-$(MAKE) start-db
	$(HOME)/pg/bin/psql -h localhost -U taapp
pull:
	git pull
	cd client && npm install && cd ..
	cd server && npm install && cd ..

.PHONY: all start-client start-server start-db psql pull attach
