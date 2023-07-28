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
If you set yourself as an admin user, you can upload csvs to the tables by following the instructions on the page.

That's it! Now you can go to https://ta-app.eecs.yorku.ca/ and see the app in action.
If you have any questions, please let me know


# TODO:
- Exporting
- Import workflow for a new semester
-- New semester wizard 
- Employee ID for applicants (optional); with warning for employee ID seniority
-- "ID is used for seniority. Leaving this blank will assume you have no seniority"
- GTA's have priority on courses which they TA'd in the previous academic year
-- Display priority to applicants and professors (Right of first refusal)
--- Move courses with priority to top of list for applicants and add label or icon
--- Move applicants with priority to top of list for professors and add label or icon
- Seniority field for students (float)
-- Importable by employee ID
- StudentID can be null
- PPY applicants should have a student ID and/or employee ID
- 

- Remove supervisor approval checkmark from student application form
- "I want to be a TA" moved to top
- Move "in person" check and "brief explanation" text to under the course preference table
- replace grade with "hover for description"
- "unsubmit" with "withdraw"

- ROFR in new table
-- student, course, term
- pool in termapplication, remove from student


- makefile or script to start up 

- SENIORITY:
-- employee ID | seniority number

- profile:
-- show profile contents in header

- Eclass aesthetics
-- font

- rename student to applicant - system wide
- rename professor to instructor - system wide

- admin import to use csv headers instead of manually typed fields
- admin export

- crontab + pg_dump to auto backup

JUL 13:
- CSV parsing with library
- student profile
- configure sample data

JUL 20:
new users to be assigned as a student
"new user" page to create entry in users table
- uses PPY id

termapplication: add studentId as column
require 1 of (studentId, applicantId)
when a new user registers, if their studentId is in termapplication,
add their userId to those entries

for future: push forward termapplication to next term

- refactor admin generic upsert
- fix profile (again)
- make sample tables
- new user page (with new termapplication table) 
https://www.postgresql.org/docs/current/ddl-constraints.html

JUL 27:
- profile view on dashboard: to display:
--> (firstname, lastname, email) from users
--> (studentnum, employeeid, pool) from applicant
- middleware for security (usertype verification)