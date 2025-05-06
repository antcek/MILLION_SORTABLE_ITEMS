@echo off
start cmd /k "cd server && npm start"
start cmd /k "cd client && npm start"
echo Both server and client are starting... 