from rest_framework import serializers
from .models import User, Course

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "is_instructor", "is_student")

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.username", read_only=True)
    students_count = serializers.SerializerMethodField()
    students = serializers.PrimaryKeyRelatedField(many=True, read_only=True)  # <--- add this

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "description",
            "level",
            "price",
            "duration",
            "instructor",
            "instructor_name",
            "students_count",
            "students",           # <--- include students
            "rating",
        ]

    def get_students_count(self, obj):
        return obj.students.count()
