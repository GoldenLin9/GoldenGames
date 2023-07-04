# Generated by Django 4.0.3 on 2022-08-18 16:44

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user', '0003_alter_bug_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bug',
            name='likes',
        ),
        migrations.AddField(
            model_name='bug',
            name='likes',
            field=models.ManyToManyField(null=True, related_name='likes', to=settings.AUTH_USER_MODEL),
        ),
    ]
