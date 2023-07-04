# Generated by Django 4.0.3 on 2023-07-02 11:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user', '0004_remove_bug_likes_bug_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bug',
            name='likes',
        ),
        migrations.AddField(
            model_name='bug',
            name='likes',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='likes', to=settings.AUTH_USER_MODEL),
        ),
    ]