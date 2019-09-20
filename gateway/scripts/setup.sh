#!/bin/bash

echo "Checking for pip installation..." && \
if [[ ! -x "$(command -v pip)" ]]; then
  echo "Installing pip..." && \
  sudo apt install -y python-dev python-pip
fi

pipversion=$(pip -V)
echo "Checking pip version..." && \
if [[ ! $pipversion == *"python2.7"* ]]; then
  echo "The kit requires python 2 and pip for python 2!"
  exit 1
fi

echo "Installing Kit..." && \

# Update the system.
echo "Updating system..." && \
sudo apt update && \

# Install utilities.
sudo apt install -y git python-spidev vim && \

# Install redis server for PubSub.
if [ -z "$(which redis-server)"]; then
    echo "Installing Redis server..." && \
    sudo apt install -y redis-server && \
    sudo systemctl start redis && \
    sudo systemctl enable redis
fi

# Lock down redis configuration /etc/redis to local only.
# Already set by default "protected-mode = yes".

# Enable SPI in interfaces.
echo "You must enable SPI under interfaces..." && \
sleep 5s && \
sudo raspi-config

# Installing SPI
if [ ! -d "SPI-Py" ]; then
    echo "Installing SPI interface..." && \
    git clone https://github.com/Freenove/SPI-Py && \
    cd SPI-Py && \
    sudo python setup.py install
fi

# Packages needed for SDK
echo "Installing Kit modules..." && \
python -m pip install --user mnemonic && \
python -m pip install --user pycrypto && \
python -m pip install --user pure25519 && \
python -m pip install --user paho-mqtt && \
python -m pip install --user redis && \
python -m pip install --user requests && \
python -m pip install --user stellar-sdk && \
python -m pip install --user toml && \

# Packages needed to build
#echo "Installing build tool..." && \
#pip install -U nuitka && \

echo "Complete!"
