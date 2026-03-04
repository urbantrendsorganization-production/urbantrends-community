from rest_framework import serializers
from .models import AIQuery

class AIQuerySerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = AIQuery
        fields = ['id', 'username', 'prompt', 'response', 'tech_stack_context', 'created_at']
        read_only_fields = ['response', 'created_at']