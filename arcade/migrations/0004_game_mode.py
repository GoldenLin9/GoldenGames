# Generated by Django 4.0.3 on 2022-05-16 02:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('arcade', '0003_scores'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='mode',
            field=models.CharField(choices=[('multi', 'Multiplayer'), ('single', 'Single-Player')], default=3, max_length=15),
            preserve_default=False,
        ),
    ]