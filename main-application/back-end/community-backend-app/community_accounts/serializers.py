from django.contrib.auth.models import User
from .models import CommunityProfile
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    """Basic User info to nest inside the Profile"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        # Create user with hashed password
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class CommunityProfileSerializer(serializers.ModelSerializer):
    # Bring in the User data as a nested object
    user = UserSerializer(read_only=True)
    
    # We can add 'calculated' fields, like a display name fallback
    effective_name = serializers.SerializerMethodField()

    class Meta:
        model = CommunityProfile
        fields = [
            'id', 
            'user', 
            'display_name', 
            'effective_name',
            'slug', 
            'avatar_url', 
            'role', 
            'bio', 
            'location', 
            'website', 
            'reputation', 
            'is_verified', 
            'created_at'
        ]
        read_only_fields = ['slug', 'reputation', 'created_at']

    def get_effective_name(self, obj):
        """Returns display_name if set, otherwise the username"""
        return obj.display_name or obj.user.username
    

class CommunityProfileUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = CommunityProfile
        fields = ['username', 'email', 'display_name', 'bio', 'location', 'avatar_url', 'website']

    def update(self, instance, validated_data):
        # Extract the user data
        user_data = validated_data.pop('user', {})
        user = instance.user

        # Update User fields
        user.username = user_data.get('username', user.username)
        user.email = user_data.get('email', user.email)
        user.save()

        # Update Profile fields
        return super().update(instance, validated_data)