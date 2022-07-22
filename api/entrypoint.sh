#!/usr/bin/env bash
flask db init
flask db migrate -m "Init migration"
flask db upgrade
python -u app.py
# flask run --host=0.0.0.0