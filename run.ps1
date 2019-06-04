$ProgressPreference= "SilentlyContinue"
Select-AzureRmProfile -Path "azureprofile.json"
Select-AzureRmSubscription -SubscriptionId 'b124cd91-de72-4792-9855-70a5858da9bd'
Stop-AzureRmWebApp -Name 'ZhuoYaoSpider2' -ResourceGroupName 'ZhuoYao'
Start-AzureRmWebApp -Name 'ZhuoYaoSpider2' -ResourceGroupName 'ZhuoYao'