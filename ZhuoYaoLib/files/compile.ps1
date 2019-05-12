Write-Host "Please add function in extern.js"

# 编译TypeScript脚本
tsc ../ts/Utils.ts ../ts/Socket.ts ../ts/Sprite.ts

# 删除已存在文件
if (Test-Path ("..\release\zhuoyao.js"))
{
	$delcmd1 = "del ..\release\zhuoyao.js"
	iex $delcmd1
}

# 对常规子版本使用Google Closure Compiler编译
$compile = "java -jar compiler.jar --compilation_level WHITESPACE_ONLY --module zhuoyao:3: --js ../ts/Utils.js --js ../ts/Socket.js ../ts/Sprite.js --externs extern.js --language_in ECMASCRIPT3"
iex $compile

# 移动到release文件夹中
$movecmd1 = "move zhuoyao.js ..\release\zhuoyao.js"
iex $movecmd1

"export default ZhuoYao;" | Out-File -Encoding "UTF8" -Append ../release/zhuoyao.js

cmd /c "pause"