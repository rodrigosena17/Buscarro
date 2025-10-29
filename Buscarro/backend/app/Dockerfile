FROM python:3.12.4

EXPOSE 8000

WORKDIR /core

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

RUN python manage.py makemigrations

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
