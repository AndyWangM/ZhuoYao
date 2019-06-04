$ProgressPreference= "SilentlyContinue"
$password = 'wad1994113'
$secpasswd = ConvertTo-SecureString $password -AsPlainText -Force
$mycreds = New-Object System.Management.Automation.PSCredential ("9ea3912e-4bb8-4096-a76a-7e04076a4674", $secpasswd)
Add-AzureRmAccount -ServicePrincipal -Tenant '504b54d2-efc8-4dc3-b5ab-c15111f0b72e' -Credential $mycreds
Select-AzureRmSubscription -SubscriptionId 'b124cd91-de72-4792-9855-70a5858da9bd'
Stop-AzureRmWebApp -Name 'ZhuoYaoSpider3' -ResourceGroupName 'ZhuoYao'
Start-AzureRmWebApp -Name 'ZhuoYaoSpider3' -ResourceGroupName 'ZhuoYao'