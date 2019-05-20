Write-Host "Please add function in extern.js"

# 编译TypeScript脚本
tsc ../ts/Utils/HashMap.ts ../ts/Utils/Storage.ts ../ts/Utils/StringUtils.ts ../ts/Utils/Utils.ts ../ts/Utils/LocationTrans.ts ../ts/Utils/HttpUtils.ts ../ts/Socket.ts ../ts/Models/Sprite.ts ../ts/Models/AliveSprite.ts ../ts/SpritesAPI.ts 

# 删除已存在文件
if (Test-Path ("..\release\zhuoyao.js"))
{
	$delcmd1 = "del ..\release\zhuoyao.js"
	iex $delcmd1
}

# 对常规子版本使用Google Closure Compiler编译WHITESPACE_ONLY/ADVANCED
$compile = "java -jar compiler.jar --compilation_level ADVANCED --module zhuoyao:10: --js ../ts/Utils/HashMap.js ../ts/Utils/StringUtils.js --js ../ts/Utils/Storage.js --js ../ts/Utils/HttpUtils.js --js ../ts/Utils/Utils.js --js ../ts/Socket.js ../ts/Models/Sprite.js ../ts/Models/AliveSprite.js ../ts/SpritesAPI.js ../ts/Utils/LocationTrans.js --externs extern.js --language_in ECMASCRIPT3"
iex $compile

# 移动到release文件夹中
$movecmd1 = "move zhuoyao.js ..\release\zhuoyao.js"
iex $movecmd1

"export default ZhuoYao;" | Out-File -Encoding "UTF8" -Append ../release/zhuoyao.js

cmd /c "pause"