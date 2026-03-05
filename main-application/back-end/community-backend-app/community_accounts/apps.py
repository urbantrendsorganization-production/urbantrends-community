from django.apps import AppConfig

class CommunityAccountsConfig(AppConfig): 
    default_auto_field = 'django.db.models.BigAutoField'
    # This must match the folder name in your project
    name = 'community_accounts'

    def ready(self):
        # We use the full path to the signals file
        import community_accounts.signals