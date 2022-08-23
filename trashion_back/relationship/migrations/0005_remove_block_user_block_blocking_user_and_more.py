# Generated by Django 4.0.6 on 2022-08-23 12:24

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('relationship', '0004_alter_block_blocked_user_alter_block_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='block',
            name='user',
        ),
        migrations.AddField(
            model_name='block',
            name='blocking_user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='blocked_user', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='block',
            name='blocked_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='blocking_user', to=settings.AUTH_USER_MODEL),
        ),
    ]
