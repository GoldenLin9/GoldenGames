# Generated by Django 4.0.3 on 2022-05-17 03:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('arcade', '0007_alter_score_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='score',
            name='extra',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='score',
            name='score',
            field=models.CharField(max_length=20),
        ),
    ]
