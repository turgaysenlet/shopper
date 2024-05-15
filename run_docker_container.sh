#/!bin/bash
# docker run -it --name myrobot --user ros --network=host --ipc=host -v $PWD/src:/src robot_image $@
xhost +
#docker run --network=host --platform linux/amd64 -e QT_QUICK_BACKEND=software -e QT_X11_NO_MITSHM=1 -p 8765:8765 -v /tmp/.X11-unix:/tmp/.X11-unix -it --name myrobot --user ros --ipc=host -v $PWD/src:/src -e DISPLAY=docker.for.mac.host.internal:0 robot_image $@

docker run -it -p 666:22 -p 8765:8765 -p 9090:9090 -p 8888:8888 --name myrobot --user ros -e DISPLAY=docker.for.mac.host.internal:0 ros2-galactic-with-realsense $@