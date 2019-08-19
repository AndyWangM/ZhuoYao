cd `dirname $0`

# 任意键退出
get_char()
{
    SAVEDSTTY=`stty -g`
    stty -echo
    stty cbreak
    dd if=/dev/tty bs=1 count=1 2> /dev/null
    stty -raw
    stty echo
    stty $SAVEDSTTY
    exit 0
}

# 发布流程
release()
{
  # 编译TypeScript脚本
  tsc ../ts/Utils/HashMap.ts ../ts/Utils/Storage.ts ../ts/Utils/StringUtils.ts ../ts/Utils/Utils.ts ../ts/Utils/LocationTrans.ts ../ts/Utils/HttpUtils.ts ../ts/Socket.ts ../ts/Models/Sprite.ts ../ts/Models/AliveSprite.ts ../ts/SpritesAPI.ts 
  
  # 对常规子版本使用Google Closure Compiler编译(WHITESPACE_ONLY, ADVANCED)
  compile="java -jar compiler.jar --compilation_level ADVANCED --module zhuoyao:10: --js ../ts/Utils/HashMap.js ../ts/Utils/StringUtils.js --js ../ts/Utils/Storage.js --js ../ts/Utils/HttpUtils.js --js ../ts/Utils/Utils.js --js ../ts/Socket.js ../ts/Models/Sprite.js ../ts/Models/AliveSprite.js ../ts/SpritesAPI.js ../ts/Utils/LocationTrans.js --externs extern.js --language_in ECMASCRIPT3"
  $compile
  
  sed -i "" '$a\
  export default ZhuoYao;' zhuoyao.js
  
  # 移动到release文件夹中
  movecmd1="mv zhuoyao.js ../release/zhuoyao.js"
  $movecmd1
}

release

echo "\nPress any key to continue!"
char=`get_char`