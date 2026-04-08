from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "status": "success",
        "message": "Wooden Hut Backend API is running",
        "endpoints": {
            "admin": "/admin/",
            "api": "/api/"
        }
    })
