from google import genai
from django.conf import settings
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import AIQuery
from .serializers import AIQuerySerializer

# Initialize Client
client = genai.Client(api_key=settings.GOOGLE_API_KEY)

class ArchitectAIViewSet(viewsets.ModelViewSet):
    queryset = AIQuery.objects.all()
    serializer_class = AIQuerySerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        prompt = serializer.validated_data.get('prompt')
        
        # Using the exact strings confirmed by your 'available_models_for_your_key' list
        model_options = [
            'gemini-2.0-flash',       # High speed, great for code
            'gemini-2.5-flash',       # Latest 2026 standard
            'gemini-flash-latest'     # General alias
        ]
        
        last_error = ""
        for model_name in model_options:
            try:
                # Note: We pass the model_name directly as found in your list
                response = client.models.generate_content(
                    model=model_name,
                    contents=f"Act as a Senior Software Architect. User: {request.user.username}. Question: {prompt}"
                )
                
                ai_instance = serializer.save(
                    user=self.request.user, 
                    response=response.text
                )
                return Response(
                    self.get_serializer(ai_instance).data, 
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                last_error = str(e)
                continue 

        return Response({
            "error": "Architect_AI models are currently unavailable.",
            "last_error": last_error
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)