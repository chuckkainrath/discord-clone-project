![Postacard Main Page](https://drive.google.com/uc?export=view&id=1NnYz5ibhZW-0IFqUbvCyDYLaV8Ek52SP)
# Postacard
Postacard is a photo website where users can upload and browse photos.  Users can create customized postcards from uploaded images.

## Features
 - Upload photos and crop them to postcard dimensions.  Photos can be either set to public or private.
 - Users can choose a photo and create a postcard from it.  Users can then save/download the postcard.  Templates can be reused.
 - Users can like/unlike photos and can view their liked photos on their profile page.
 - Users can follow/unfollow other users and can view their follows/followers on their profile page.

## Technology

 - ReactJS
 - Redux
 - AWS S3
 - KonvaJS
 - Flask
 - SQLAlchemy
 - PostgreSQL

## Installation

1. Clone the repo and install dependencies

```
git clone https://github.com/chuckkainrath/postcard.git
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

## Features
