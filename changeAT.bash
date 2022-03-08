if [ $# -ne 3 ];then
  echo "Usage: $0 remote user repository"
  exit 1
fi
git remote remove $1
git remote add $1 https://${GH_KEY}@github.com/$2/$3
git remote -v
