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
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "student")

        if not username or not email or not password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_instructor=(role=="instructor"),
            is_student=(role=="student"),
        )

        return Response({"message": "Registration successful", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"message": "Login successful", "user": UserSerializer(user).data}, status=status.HTTP_200_OK)


# -------------------- Course --------------------
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
        return Response(CourseSerializer(course).data)

    def put(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        instructor_id = request.data.get("instructor")
        if not instructor_id or int(instructor_id) != course.instructor.id:
            return Response({"error": "Only instructor or superuser can update"}, status=status.HTTP_403_FORBIDDEN)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        instructor_id = request.data.get("instructor")
        if not instructor_id or int(instructor_id) != course.instructor.id:
            return Response({"error": "Only instructor or superuser can delete"}, status=status.HTTP_403_FORBIDDEN)

        course.delete()
        return Response({"message": "Course deleted"}, status=status.HTTP_204_NO_CONTENT)
