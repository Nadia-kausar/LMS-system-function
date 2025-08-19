from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User, Course
from .serializers import UserSerializer, CourseSerializer


# -------------------- Auth Views --------------------
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role", "student")  # "student" or "instructor"

        if not username or not email or not password:
            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_instructor=(role == "instructor"),
            is_student=(role == "student"),
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Registration successful",
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)
        if not user:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "user": UserSerializer(user).data,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)


# -------------------- Course Views --------------------
class CourseListView(APIView):
    # Public access to view courses
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Only instructors can add courses
        if not request.user.is_authenticated or not request.user.is_instructor:
            return Response(
                {"error": "Only instructors can add courses"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(instructor=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDetailView(APIView):
    permission_classes = [permissions.AllowAny]  # Anyone can view details

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
        if course.instructor != request.user:
            return Response(
                {"error": "You can't update this course"},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        course = self.get_object(pk)
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        if course.instructor != request.user:
            return Response(
                {"error": "You can't delete this course"},
                status=status.HTTP_403_FORBIDDEN
            )
        course.delete()
        return Response({"message": "Course deleted"}, status=status.HTTP_204_NO_CONTENT)


class EnrollCourseView(APIView):
    # Enrollment requires login
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        course = Course.objects.filter(pk=pk).first()
        if not course:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        if request.user.is_instructor:
            return Response(
                {"error": "Instructors cannot enroll"},
                status=status.HTTP_403_FORBIDDEN
            )
        course.students.add(request.user)
        return Response({"message": "Enrolled successfully"}, status=status.HTTP_200_OK)
