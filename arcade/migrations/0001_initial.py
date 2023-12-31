# Generated by Django 4.0.3 on 2022-05-16 02:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateField()),
                ('competitive', models.BooleanField()),
                ('name', models.TextField(max_length=50)),
                ('image', models.ImageField(upload_to='')),
            ],
        ),
    ]
