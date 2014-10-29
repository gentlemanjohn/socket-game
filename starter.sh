#!/bin/sh
if [ $(ps -e -o uid,cmd | grep $UID | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then
        export PATH=/usr/local/bin:$PATH
        forever start --spinSleepTime 10000 /srv/www/socket/server.js >> /srv/www/socket/log.txt 2>&1
fi
