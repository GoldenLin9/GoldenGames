# Generated by Django 4.0.3 on 2022-05-21 07:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('arcade', '0013_remove_game_context'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='context',
            field=models.CharField(blank=True, max_length=20),
        ),
    ]