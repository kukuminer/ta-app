all: start
start: pull
	tmux has -t ta-app || tmux \
		new-session -d -s ta-app "$(MAKE) start-client" \; \
		split-window -h          "$(MAKE) start-server" \; \
		split-window -h          "$(MAKE) psql" \; \
		select-layout even-horizontal
	tmux attach -t ta-app
start-client:
	$(MAKE) -C client start
start-server:
	$(MAKE) -C server start
start-db:
	cd ../pg && bin/pg_ctl -D data/ -l pg.log start
backup-db:
	cd ../pg && bin/pg_dump taapp > backup_$(shell date +'%Y%m%d%H%M%S').sql

psql:
	-$(MAKE) start-db
	$(HOME)/pg/bin/psql -h localhost -U taapp
pull:
	git pull

.PHONY: all start-client start-server start-db psql pull
