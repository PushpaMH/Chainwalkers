# The line below states, we will base our chainwalker image on Ubuntu 16.04
FROM ubuntu:16.04

# Identify the maintainer of an image
MAINTAINER My Name "IBM Analytics"

# Update the image to the latest packages
RUN apt-get update && apt-get upgrade -y

# Make /usr/src directory
RUN mkdir -p /usr/src

# Make /usr/src the home directory for the image
WORKDIR /usr/src

# Copy all the chainwalker app related file/folders to /usr/src
COPY . /usr/src

# Expose the port 8000 and 9000 on which the chainwalk app and csUI app will run
EXPOSE 8000 9000


# Execute startup script for which user will acknowledge the License Acceptance
# and then install all the required pre-requisites to run the chainwalker app
CMD ["bash","./startup.sh"]
