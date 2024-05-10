#/!bin/bash
set -e

source /opt/ros/galactic/setup.bash

echo Starting  SSH server

sudo service ssh start

echo Running Foxglove brige

ros2 run foxglove_bridge foxglove_bridge port:=8765&

echo "Provided arguments: $@"

exec $@