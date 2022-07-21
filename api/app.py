import os
from datetime import date
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
db.create_all()

#! Journal Model


class Journal(db.Model):
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


migrate = Migrate(app, db)


def convertToJson(_value):
    return json.dumps(_value, indent=4, sort_keys=True, default=str)


@app.route('/api/journal', methods=['GET', 'POST', 'PUT'])
def index():
    if request.method == 'GET':
        journals = Journal.query.all()
        jsonJournal = []
        for journal in journals:
            jsonJournal.append(journal)
        response = make_response(jsonify(jsonJournal))
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Content-Type'] = 'application/json'
        response.status_code = 200
        return response

    if request.method == 'POST':
        data = json.dumps(request.json)
        # check if
        if request.data:
            # Save to DB
            journal = Journal(
                data['title'], data['description'], date.today(), date.today())
            db.session.add(journal)
            db.session.commit()

            # Handle response
            response = make_response(
                jsonify({"message": 'success add journal'}))
            response.status_code = 200
            return response
        else:
            response = make_response(
                jsonify({"message": 'data is required'}))
            response.status_code = 403
            return response

    if request.method == 'PUT':
        data = json.dumps(request.json)
        if request.data:
            journal = Journal.query.get(data['id'])
            if(journal):
                journal['title'] = data['title']
                journal['description'] = data['description']
                journal['updated_at'] = date.today()
                db.session.commit()

                response = make_response(
                    jsonify({"message": 'success update'}))
                response.status_code = 200
                return response
            else:
                response = make_response(
                    jsonify({"message": 'data not found'}))
                response.status_code = 404
                return response


@app.route('/api/journal/<id>', methods=['GET', 'DEL'])
def index2(id):
    if request.method == 'DEL':
        journal = Journal.query.filter_by(id=id)
        if(journal):
            # journal.delete()
            # db.session.commit()

            response = make_response(
                jsonify({"message": 'success update'}))
            response.status_code = 200
            return response


@app.route('/api/test', methods=['GET', 'DEL'])
def index5():
    return 'test'


#! process
if __name__ == '__main__':
    app.run(host='0.0.0.0')
