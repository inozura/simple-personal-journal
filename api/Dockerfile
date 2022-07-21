FROM python:3.8

RUN mkdir /backend
WORKDIR /backend

ADD requirements.txt /backend
RUN pip install -r requirements.txt
ADD . /backend

# RUN flask db upgrade
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT "/entrypoint.sh"
# CMD python app.py