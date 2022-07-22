![Racket App Main Page](https://drive.google.com/uc?export=view&id=18Rs0NeL8sJnrKOKTbHWllMYLik2cuM8X)

# Racket
Racket is a chat application inspired by discord where users can create servers and channels as well as send messages.  Users can also invite their friends to servers so they can chat in real time.

## Features
 - Users can create servers and invite others to join those servers.
 - Users can recieve invites to join servers from other users.
 - Users can create different channels for each server for others to message in.
 - Users can send messages in real time to channels within servers.

## Technology

 - ReactJS
 - Redux
 - Flask
 - Websockets
 - SQLAlchemy
 - PostgreSQL

## Installation

1. Clone the repo and install dependencies

```
git clone https://github.com/chuckkainrath/discord-clone-project.git
pipenv install --dev -r dev-requirements.txt && pipenv install -r requirements.txt
```

2. Create a .env file based on the example.
3. Setup database user, password and database.
4. Migrate/Seed database
pipenv shell
```
flask db upgrade
flask db seed all
flask db run
```
5. Install the frontend dependencies and run
```
cd react-app
npm install
npm start
```
