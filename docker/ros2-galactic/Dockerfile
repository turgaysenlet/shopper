FROM osrf/ros:galactic-desktop

# Needed to run add-apt-repository
RUN apt-get update \
  && apt-get install -y software-properties-common apt-transport-https

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

RUN add-apt-repository universe

# Sublimetext
  # RUN curl -fsSL https://download.sublimetext.com/sublimehq-pub.gpg | apt-key add -
# RUN add-apt-repository "deb https://download.sublimetext.com/ apt/stable/"
# RUN apt-get install -y sublime-text 

# USER ros
# USER root

RUN apt-get update \
  && apt-get install -y sudo net-tools nano curl wget gnupg git vim  iputils-ping \
    terminator curl synaptic x11-apps openssh-server lsb-release openssh-server \  
    python3-pip python3-colcon-common-extensions python3-rosdep \
    ros-galactic-desktop \
    ros-galactic-rviz2 ros-galactic-navigation2 ros-galactic-nav2-* ros-galactic-slam-toolbox ros-galactic-turtlebot3* ros-galactic-gazebo-dev ros-galactic-gazebo-ros2-control ros-galactic-gazebo-ros2-control-demos ros-galactic-gazebo-msgs ros-galactic-gazebo-plugins \
    ros-galactic-depthimage-to-laserscan \    
    ros-galactic-foxglove-bridge ros-galactic-rosbridge-suite \        
    ros-galactic-rmw-cyclonedds-cpp \    
  && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME\
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  && rm -rf /var/lib/apt/lists/*

  # Append the source command to .bashrc
RUN echo "source /opt/ros/galactic/setup.bash" >> /.bashrc
RUN echo "source /opt/ros/galactic/setup.bash" >> /etc/bash.bashrc
RUN echo "echo Sourcing the system-wide /etc/bash.bashrc" >> /etc/bash.bashrc

ENV QT_QUICK_BACKEND=software
ENV LIBGL_ALWAYS_INDIRECT=1

# Enable SSH access and permit password authentication
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Expose SSH port, map to 666 on the localhost
EXPOSE 22
# Expose Foxglove websocket port, map to 8765 on the localhost
EXPOSE 8765
# Expose rosbridge_server rosbridge_websocket_launch port in the localhost, map to 9090 on the localhost
EXPOSE 9090
# Expose rosboard port in the localhost, map to 8888 on the localhost
# https://github.com/dheera/rosboard?tab=readme-ov-file
EXPOSE 8888

COPY entrypoint.sh /entrypoint.sh
# Automatically executed startup script
ENTRYPOINT [ "/bin/bash", "/entrypoint.sh" ]

# Paramters to pass to entrypoint
CMD [ "bash" ]

