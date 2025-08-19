from rest_framework import serializers
from .models import User, Course

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "is_instructor", "is_student")

class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.username", read_only=True)
    students = UserSerializer(read_only=True, many=True)  # Include enrolled students
    students_count = serializers.SerializerMethodField()

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
            "students",
            "students_count",
            "rating",
        ]

    def get_students_count(self, obj):
        return obj.students.count()
