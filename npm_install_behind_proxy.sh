#!/bin/bash

read -p "Your proxy username (e.g. C123456): " USERNAME  
read -s -p "Your password: " PASSWORD

npm install --strict-ssl false --proxy http://$USERNAME:$PASSWORD@websenseproxy.standardbank.co.za:8080/ --https-proxy http://$USERNAME:$PASSWORD@websenseproxy.standardbank.co.za:8080/
