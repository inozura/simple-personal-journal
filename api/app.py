import os
import time
from sqlalchemy import inspect
from sqlalchemy_serializer import SerializerMixin
from sys import stdout
from flask import Flask, make_response, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from sqlalchemy.sql import func
import json
from dotenv import load_dotenv
load_dotenv()

#! ENV Variable
db_user = os.getenv("DATABASE_USER")
db_pass = os.getenv("DATABASE_USER_PASSWORD")
db_name = os.getenv("DATABASE_NAME")

#! init
app = Flask(__name__)
app.debug = True
CORS(app)

# SqlAlchemy Database Configuration With Mysql
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://root:root@db:3306/personal_journal"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#! Journal Model


class Journal(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())

    def __init__(self, title, description, created_at, updated_at):
        self.title = title
        self.description = description
        self.created_at = created_at
        self.updated_at = updated_at

    def toDict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


migrate = Migrate(app, db)


def convertToJson(_value):
    return json.dumps(_value, indent=4, sort_keys=True, default=str)


def convertToDate(date):
    return int(time.mktime(date.timeuple())) * 1000


@app.route('/api/journal', methods=['GET', 'POST', 'PUT'])
def index():
    if request.method == 'GET':
        journals = Journal.query.all()
        jsonJournal = []
        for journal in journals:
            jsonJournal.append(journal.toDict())
        response = make_response(jsonify(jsonJournal))
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 200
        return response

    if request.method == 'POST':
        data = request.json
        if request.data:
            # Save to DB
            journal = Journal(
                data['title'], data['description'], data['date'], data['date'])
            db.session.add(journal)
            db.session.commit()

            # Handle response
            response = make_response(
                jsonify({"message": 'success add journal'}))
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.status_code = 200
            return response
        else:
            response = make_response(
                jsonify({"message": 'data is required'}))
            response.status_code = 403
            return response


@app.route('/api/journal/<id>', methods=['GET', 'DELETE', 'PUT'])
def with_id(id):
    if request.method == 'GET':
        journal = Journal.query.get(id)
        if(journal != None):
            response = make_response(
                jsonify(journal.toDict()))
            response.status_code = 200
            return response
        else:
            response = make_response(
                jsonify({"message": 'data not found'}))
            response.status_code = 404
            return response

    if request.method == 'DELETE':
        journal = Journal.query.filter_by(id=id)
        if journal != None:
            journal.delete()
            db.session.commit()

            response = make_response(
                jsonify({"message": 'success delete'}))
            response.status_code = 200
            return response
        else:
            response = make_response(
                jsonify({"message": 'data not found'}))
            response.status_code = 404
            return response

    if request.method == 'PUT':
        data = request.json
        if request.data != None:
            journal = Journal.query.filter_by(id=id)
            if(journal):
                journal.update(dict(title=data['title']))
                journal.update(dict(description=data['description']))
                journal.update(dict(updated_at=data['date']))
                db.session.commit()

                response = make_response(
                    jsonify({"message": 'success update'}))
                response.headers['Access-Control-Allow-Origin'] = '*'
                response.status_code = 200
                return response
            else:
                response = make_response(
                    jsonify({"message": 'data not found'}))
                response.status_code = 404
                return response


#! process
if __name__ == '__main__':
    app.run(host='0.0.0.0')
