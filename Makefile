all: start
start:
	tmux has -t ta-app || tmux \
		new-session -d -A -s ta-app -c "$(MAKE) start-client" \; \
		split-window -h                "$(MAKE) start-server" \; \
		split-window -h                "$(MAKE) psql" \; \
		select-layout even-horizontal
	tmux attach -t ta-app
start-client:
	$(MAKE) -C client start
start-server:
	$(MAKE) -C server start
start-db:
	cd ../pg && bin/pg_ctl -D data/ -l pg.log start

psql:
	-$(MAKE) start-db
	$(HOME)/pg/bin/psql -h localhost -U taapp
