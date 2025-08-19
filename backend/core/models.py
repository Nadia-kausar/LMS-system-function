from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    is_instructor = models.BooleanField(default=False)
    is_student = models.BooleanField(default=True)

    def __str__(self):
        return self.username


class Course(models.Model):
    LEVEL_CHOICES = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    level = models.CharField(max_length=50, choices=LEVEL_CHOICES, default="Beginner")
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    duration = models.CharField(max_length=50, default="4 weeks")
    instructor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="courses"
    )
    students = models.ManyToManyField(
        User, related_name="enrolled_courses", blank=True
    )
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
