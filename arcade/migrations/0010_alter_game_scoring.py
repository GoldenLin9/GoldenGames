# Generated by Django 4.0.3 on 2022-05-20 00:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('arcade', '0009_remove_score_extra_game_scoring'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='scoring',
            field=models.CharField(blank=True, choices=[('Timer', 'Timer'), ('Points', 'Points')], max_length=20),
        ),
    ]