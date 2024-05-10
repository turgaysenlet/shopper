#/!bin/bash
echo Stopping myrobot:
docker container kill myrobot
echo Removing myrobot:
docker container rm myrobot
echo Pruning all images:
docker image prune -f