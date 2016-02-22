#! /bin/sh

cmd="cd src/"
eval $cmd
cmd1="rabbitmq-server > /dev/null 2>&1 &"
eval $cmd1
cmd2="service postgresql start"
eval $cmd2
su - postgres <<EOSU
psql -c "ALTER USER postgres with password 'postgres';"
exit 0
EOSU
cmd3="gulp"
eval $cmd3