from django.urls import path
from .views import (
    RegisterView, LoginView,
    CourseListView, CourseDetailView,
    EnrollView, MyEnrollmentsView,
    LessonListCreateView, LessonDetailView, MyLessonsView
)

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),

    # Courses
    path("courses/", CourseListView.as_view(), name="course-list"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),

    # Enrollment
    path("courses/<int:pk>/enroll/", EnrollView.as_view(), name="course-enroll"),
    path("my-enrollments/", MyEnrollmentsView.as_view(), name="my-enrollments"),

    # Lessons
    path("courses/<int:course_id>/lessons/", LessonListCreateView.as_view(), name="lesson-list-create"),
    path("lessons/<int:pk>/", LessonDetailView.as_view(), name="lesson-detail"),
    path("courses/<int:course_id>/lessons/<int:student_id>/", MyLessonsView.as_view(), name="my-lessons"),
]