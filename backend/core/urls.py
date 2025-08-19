from django.urls import path
from .views import RegisterView, LoginView, CourseListView, CourseDetailView, EnrollView, MyEnrollmentsView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("courses/", CourseListView.as_view(), name="course-list"),
    path("courses/<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    path("courses/<int:pk>/enroll/", EnrollView.as_view(), name="course-enroll"),
    path("my-enrollments/", MyEnrollmentsView.as_view(), name="my-enrollments"),
]
