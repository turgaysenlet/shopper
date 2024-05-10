#/!bin/bash
set -e

source /opt/ros/humble/setup.bash

echo Starting  SSH server

sudo service ssh start

echo Running Foxglove brige

ros2 launch foxglove_bridge foxglove_bridge_launch.xml port:=8765&

echo "Provided arguments: $@"

exec $@