#/!bin/bash
docker run -it -p 666:22 -p 8765:8765 -p 9090:9090 -p 8888:8888 --user ros ros2-galactic:latest $@