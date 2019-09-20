#!/bin/bash

# TODO: enable?
echo "Building binary disabled!"
exit 1

# remove the previous build files
echo "Removing old build..." && \
rm -fR starter-kit main.dist && \

# build the binary using nuitka
# -o                = output file name
# --follow-imports  = follow imported files for build
# --remove-output   = will remove build directory
# --show-progress   = show build progress information
# --standalone      = combine into single binary
echo "Making new build..." && \
python -m nuitka --follow-imports --remove-output --standalone main.py && \

# move the binary main.bin to starter-kit binary
#cp main.dist/main starter-kit && \

# make sure starter-kit is executable
#chmod a+x starter-kit && \

echo "Finished!"
