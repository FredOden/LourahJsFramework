root=${2:-/storage/emulated/0}
wd=${root}/${1:-LourahJsFramework}
echo wd="$wd"
#IFS="\n"
find . -name '*.js' -print|while read path; do
        #file=`echo $path | sed 's/ /\\ /g'`
	file=$path
        target=$wd/$file
	if [ ! -e "$target" ];then
		echo "cp \"$file\" \"$target\""
		continue;
	fi
	#echo $file'::'$target
	s1=`stat --printf=%s "$file"`
	s2=`stat --printf=%s "$target"`
	#echo $s1"::"$s2
	#continue
	if [ $s1 -ne $s2 ]; then
		echo $file":"$s1"::"$s2
		diff "$file" "$target"
	fi
done

