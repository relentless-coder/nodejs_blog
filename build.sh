#!/bin/bash

cd /home/ubuntu/nodejs_blog
sudo mv /home/ubuntu/uploads /home/ubuntu/nodejs_blog/
sudo yarn install
sudo yarn build
