# Generated by Django 4.0.3 on 2022-05-16 21:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('arcade', '0006_score_delete_scores'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='score',
            field=models.TextField(max_length=20),
        ),
    ]
