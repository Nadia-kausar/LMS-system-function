from django.contrib import admin
from .models import User, Course, Lesson, Enrollment


# ------------------ User ------------------
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_instructor", "is_student", "is_staff")
    list_filter = ("is_instructor", "is_student", "is_staff")
    search_fields = ("username", "email")


# ------------------ Course ------------------
class LessonInline(admin.TabularInline):   # Show lessons directly inside course
    model = Lesson
    extra = 1   # how many empty forms to show for adding new lessons


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "instructor", "level", "price", "rating", "created_at")
    list_filter = ("level", "instructor", "created_at")
    search_fields = ("title", "description")
    inlines = [LessonInline]   # 👈 will display lessons inside course admin page


# ------------------ Lesson ------------------
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "created_at")
    search_fields = ("title", "course__title")


# ------------------ Enrollment ------------------
@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "enrolled_at")
    list_filter = ("course", "enrolled_at")
    search_fields = ("student__username", "course__title")
