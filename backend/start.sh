#!/bin/sh
set -e

flask db upgrade
exec gunicorn run:app

