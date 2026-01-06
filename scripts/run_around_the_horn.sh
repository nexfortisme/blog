cd ../content
./update_and_push_posts.sh

current_datetime="$(date '+%Y-%m-%d %H:%M:%S')" 
msg="Content Update at $current_datetime"

cd ..
git add -A
git c -m msg
git pu

cd blog
bun run build
firebase deploy