import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, Users, Posts, Media, Followers, Comments, CharacterFavorites, PlanetsFavorites, Characters, Planets


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'darkly'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(Users, db.session))
    # You can duplicate that line to add mew models
    admin.add_view(ModelView(CharacterFavorites, db.session))
    admin.add_view(ModelView(Characters, db.session))
    admin.add_view(ModelView(PlanetsFavorites, db.session))
    admin.add_view(ModelView(Planets, db.session))
    admin.add_view(ModelView(Posts, db.session))
    admin.add_view(ModelView(Media, db.session))
    admin.add_view(ModelView(Followers, db.session))
    admin.add_view(ModelView(Comments, db.session))
    # admin.add_view(ModelView(YourModelName, db.session))
    