#!/usr/bin/env bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
flask run --host=0.0.0.0