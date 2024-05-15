FROM turgaysenlet/ros2-galactic:latest

# Realsense ROS2

# Realsense lib
RUN mkdir -p /etc/apt/keyrings
RUN curl -sSf https://librealsense.intel.com/Debian/librealsense.pgp | sudo tee /etc/apt/keyrings/librealsense.pgp > /dev/null
RUN echo "deb [signed-by=/etc/apt/keyrings/librealsense.pgp] https://librealsense.intel.com/Debian/apt-repo `lsb_release -cs` main" | \
  tee /etc/apt/sources.list.d/librealsense.list

RUN apt-get update \
  && apt-get install -y ros-galactic-realsense2-camera ros-galactic-realsense2-camera-msgs ros-galactic-realsense2-description ros-galactic-librealsense2

RUN apt-get install -y librealsense2=2.50.0-0~realsense0.6128 librealsense2-gl=2.50.0-0~realsense0.6128 librealsense2-udev-rules=2.50.0-0~realsense0.6128 librealsense2-utils=2.50.0-0~realsense0.6128 librealsense2-dkms=1.3.24-0ubuntu1 librealsense2-net=2.50.0-0~realsense0.6128

# Stop REALSENSE FROM UPDATING TO FURTHER VERSIONS
# This is needed to not lose support for T265 sensor
RUN apt-mark hold librealsense2
RUN apt-mark hold librealsense2-gl
RUN apt-mark hold librealsense2-udev-rules
RUN apt-mark hold librealsense2-utils
RUN apt-mark hold librealsense2-net

RUN apt-get remove -y python3-tornado

RUN rm -rf /var/lib/apt/lists/*
