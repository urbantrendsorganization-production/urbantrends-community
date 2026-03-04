from django.db import models
from django.contrib.auth.models import User

class AIQuery(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_queries')
    prompt = models.TextField()
    response = models.TextField(blank=True, null=True)
    tech_stack_context = models.CharField(max_length=255, blank=True) # e.g., "Django, React"
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Architect AI Query"

    def __str__(self):
        return f"Query by {self.user.username} at {self.created_at}"