# ta-app

Online application and selection platform for teaching assistants

I have deployed the app with the new changes. You can check the commit history for more details.
I also figured out the "/" redirecting to "/index", although I think it is a workaround:
Adding DirectoryIndex /profile allows the site to work by overwriting to a default location that I think doesn't actually exist.
However, I did add a redirect from my app that redirects / to /dashboard, or to /profile if the user is not present in the db yet.

I will make the video today and submit it, and then take a break for the weekend. I can continue working on finishing touches more next week.
To see the deployed version, do the following:

1. run `npm start` in /ta-app/server
2. run `npm run deploy` in /ta-app/client/build
3. configure the psql server so that you have the usertype you want. (to access psql, do `~/pg/bin/psql -h localhost -U taapp taapp`
4. to start psql server, run `bin/pg_ctl -D data/ -l pg.log start`
   If you set yourself as an admin user, you can upload csvs to the tables by following the instructions on the page.

That's it! Now you can go to https://ta-app.eecs.yorku.ca/ and see the app in action.
If you have any questions, please let me know

TO ACCESS:

1. ssh project1
2. bu ta-app
3. cd

TO UPDATE REPO:

1. cd ta-app
2. git status (to ensure the repo is present)
3. git pull
4. cd ta-app/client
5. npm i
6. npm audit fix --force (if vulnerabilities present (client folder may still have a few, just ignore them. repeat this step until the number is the minimum))
7. repeat 5. and 6. in ta-app/server
8. run using following steps

FOR FRONT END:

1. cd ta-app/client
2. npm run build
3. cd build
4. npm run deploy

START BACKEND:

1. cd ta-app/server
2. npm start

START PSQL:

1. cd ta-app/pg
2. bin/pg_ctl -D data/ -l pg.log start

ACCESS PSQL:

1. ~/pg/bin/psql -h localhost -U taapp

# Resources:

https://www.postgresql.org/docs/current/ddl-constraints.html
https://fontawesome.com/
https://github.com/ngduc/react-tabulator#readme
