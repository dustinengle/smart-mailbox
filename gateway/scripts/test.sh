#!/bin/bash

echo "Starting tests..."
python -m unittest discover -p '*_test.py'
