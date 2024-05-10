FROM osrf/ros:humble-desktop-full

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

# USER ros
# USER root

RUN apt-get update \
  && apt-get install -y sudo net-tools nano curl wget iputils-ping openssh-server x11-apps ros-$ROS_DISTRO-foxglove-bridge\
  && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME\
  && chmod 0440 /etc/sudoers.d/$USERNAME \
  && rm -rf /var/lib/apt/lists/*

# Append the source command to .bashrc
RUN echo "source /opt/ros/humble/setup.bash" >> /.bashrc
RUN echo "source /opt/ros/humble/setup.bash" >> /etc/bash.bashrc
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