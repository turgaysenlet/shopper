#/!bin/bash
# Check local images
docker images

# Build the image (if not already built)
docker build -t ros2-galactic:latest .

# Tag the image
docker tag ros2-galactic:latest turgaysenlet/ros2-galactic:latest

# Log in to Docker Hub
docker login

# Push the image
docker push turgaysenlet/ros2-galactic:latest
