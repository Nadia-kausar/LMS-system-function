from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User, Course
from .serializers import UserSerializer, CourseSerializer

# -------------------- Auth --------------------
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        username, email, password = data.get("username"), data.get("email"), data.get("password")
        role = data.get("role", "student")

        if not username or not email or not password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username, email=email, password=password,
            is_instructor=(role=="instructor"), is_student=(role=="student")
        )
        return Response({"message": "Registration successful", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username, password = request.data.get("username"), request.data.get("password")
        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"message": "Login successful", "user": UserSerializer(user).data}, status=status.HTTP_200_OK)


# -------------------- Courses --------------------
class CourseListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request):
        instructor_id = request.data.get("instructor")
        if not instructor_id:
            return Response({"error": "Instructor ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instructor = User.objects.get(pk=instructor_id)
        except User.DoesNotExist:
            return Response({"error": "Instructor not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(instructor=instructor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get_object(self, pk):
        return Course.objects.filter(pk=pk).first()

    def get(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        data = CourseSerializer(course).data
        data["students"] = UserSerializer(course.students.all(), many=True).data
        data["students_count"] = course.students.count()
        return Response(data)

    def put(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        course.delete()
        return Response({"message": "Course deleted successfully"})


# -------------------- Enrollment --------------------
class EnrollView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        course = Course.objects.filter(pk=pk).first()
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        student_id = request.data.get("student_id")
        if not student_id:
            return Response({"error": "Student ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = User.objects.get(pk=student_id)
        except User.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        if student in course.students.all():
            return Response({"error": "Already enrolled"}, status=status.HTTP_400_BAD_REQUEST)

        course.students.add(student)
        course.save()

        return Response({
            "message": "Enrolled successfully",
            "course": CourseSerializer(course).data,
            "student_name": student.username
        })


class MyEnrollmentsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        student_id = request.query_params.get("student_id")
        if not student_id:
            return Response({"error": "Student ID required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            student = User.objects.get(pk=student_id)
        except User.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

        courses = student.enrolled_courses.all()
        data = [
            {
                "id": c.id,
                "title": c.title,
                "description": c.description,
                "level": c.level,
                "price": c.price,
                "duration": c.duration,
                "instructor": c.instructor.username,
                "enrolled_at": c.updated_at,
            }
            for c in courses
        ]
        return Response(data)
