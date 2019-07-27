#!/bin/sh
set -e

if [ "${1}" = 'grunt' ]; then
    exec "${@}"
fi

exec "${@}"
