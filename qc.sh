#!/bin/bash
#
# Usage: ./qc.sh "{commit message}"
#

if [ -n "$1" ]; then
  MESSAGE=$1
else
  MESSAGE="Changed by $USER"
fi

#find . -name "*.sh" | xargs dos2unix
#find . -name "*.sh" | xargs chmod 755

git add --all :/
git commit -am "$MESSAGE"
