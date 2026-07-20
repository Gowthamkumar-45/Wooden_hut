from django.db import migrations

DEFAULT_CATEGORIES = [
    ("Living", "living"),
    ("Dining", "dining"),
    ("Bedroom", "bedroom"),
    ("Office", "office"),
    ("Doors & Windows", "doors-and-windows"),
]


def seed_categories(apps, schema_editor):
    Category = apps.get_model('products', 'Category')
    for name, slug in DEFAULT_CATEGORIES:
        Category.objects.get_or_create(slug=slug, defaults={'name': name})


def noop_reverse(apps, schema_editor):
    # Default categories are load-bearing for the live site's nav/category
    # pages, so removing this migration should not delete them.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0011_alter_category_slug_alter_subcategory_slug'),
    ]

    operations = [
        migrations.RunPython(seed_categories, noop_reverse),
    ]
