from django.db import migrations


def add_photo_frames(apps, schema_editor):
    Category = apps.get_model('products', 'Category')
    Category.objects.get_or_create(slug='photo-frames', defaults={'name': 'Photo Frames'})


def noop_reverse(apps, schema_editor):
    # Deliberately left as a no-op — same reasoning as 0012: this category is
    # now load-bearing for the live site's nav, so rolling back this
    # migration should not delete it (and any sub-categories/products an
    # admin has since added under it).
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0012_seed_default_categories'),
    ]

    operations = [
        migrations.RunPython(add_photo_frames, noop_reverse),
    ]
