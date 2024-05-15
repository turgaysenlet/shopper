FROM turgaysenlet/ros2-galactic-with-realsense:latest

RUN mkdir -p /home/ros/ros2_ws/src
RUN pip3 install tornado simplejpeg

#USER root
COPY src /home/ros/ros2_ws/src
RUN chown ros:ros -R /home/ros/
WORKDIR /home/ros/ros2_ws/src
RUN git clone https://github.com/dheera/rosboard.git