FROM osrf/ros:galactic-desktop

ARG USERNAME=ros
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create a non-root user
RUN groupadd --gid $USER_GID $USERNAME \
  && useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m $USERNAME \
  && mkdir /home/$USERNAME/.config \
  && chown $USER_UID:$USER_GID /home/$USERNAME/.config

RUN echo 'root:YOURPASSWORD' | chpasswd
RUN echo 'ros:YOURPASSWORD' | chpasswd

RUN apt-get update \
  && apt-get install -y software-properties-common apt-transport-https

RUN curl -fsSL https://download.sublimetext.com/sublimehq-pub.gpg | apt-key add -
RUN add-apt-repository "deb https://download.sublimetext.com/ apt/stable/"

RUN add-apt-repository universe
# USER ros
# USER root

RUN apt-get update \
  && apt-get install -y sublime-text sudo net-tools nano curl wget gnupg iputils-ping openssh-server x11-apps \
    ros-galactic-foxglove-bridge ros-galactic-rosbridge-suite \    
    git vim terminator curl synaptic openssh-server \
    python3-colcon-common-extensions python3-rosdep \
    ros-galactic-desktop ros-galactic-realsense2-camera ros-galactic-realsense2-camera-msgs ros-galactic-realsense2-description ros-galactic-librealsense2 ros-galactic-depthimage-to-laserscan ros-galactic-rviz2 ros-galactic-navigation2 ros-galactic-nav2-* ros-galactic-slam-toolbox ros-galactic-turtlebot3* ros-galactic-gazebo-dev ros-galactic-gazebo-ros2-control ros-galactic-gazebo-ros2-control-demos ros-galactic-gazebo-msgs ros-galactic-gazebo-plugins \
    ros-galactic-rmw-cyclonedds-cpp \
    lsb-release \
  && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME\
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  && rm -rf /var/lib/apt/lists/*

# Realsense
RUN mkdir -p /etc/apt/keyrings
RUN curl -sSf https://librealsense.intel.com/Debian/librealsense.pgp | sudo tee /etc/apt/keyrings/librealsense.pgp > /dev/null
RUN echo "deb [signed-by=/etc/apt/keyrings/librealsense.pgp] https://librealsense.intel.com/Debian/apt-repo `lsb_release -cs` main" | \
  tee /etc/apt/sources.list.d/librealsense.list
RUN apt-get update
RUN apt-get install -y librealsense2=2.50.0-0~realsense0.6128 librealsense2-gl=2.50.0-0~realsense0.6128 librealsense2-udev-rules=2.50.0-0~realsense0.6128 librealsense2-utils=2.50.0-0~realsense0.6128 librealsense2-dkms=1.3.24-0ubuntu1 librealsense2-net=2.50.0-0~realsense0.6128

# Stop REALSENSE FROM UPDATING TO FURTHER VERSIONS
RUN apt-mark hold librealsense2
RUN apt-mark hold librealsense2-gl
RUN apt-mark hold librealsense2-udev-rules
RUN apt-mark hold librealsense2-utils
RUN apt-mark hold librealsense2-net

RUN apt-get remove python3-tornado

# Append the source command to .bashrc
RUN echo "source /opt/ros/galactic/setup.bash" >> /.bashrc
RUN echo "source /opt/ros/galactic/setup.bash" >> /etc/bash.bashrc
RUN echo "echo Sourcing the system-wide /etc/bash.bashrc" >> /etc/bash.bashrc

RUN mkdir -p /home/ros/ros2_ws/src
COPY entrypoint.sh /entrypoint.sh
COPY src /home/ros/ros2_ws/src

ENV QT_QUICK_BACKEND=software
ENV LIBGL_ALWAYS_INDIRECT=1

# Enable SSH access and permit password authentication
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Expose SSH port
EXPOSE 22
EXPOSE 8765

# Automatically executed startup script
ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]

# Paramters to pass to entrypoint
CMD [ "bash" ]