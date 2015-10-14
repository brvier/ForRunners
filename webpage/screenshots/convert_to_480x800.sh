#!/bin/sh

# Use a simple shell loop, to process each of the images.
mkdir 480x800
for f in *.png
do convert $f -resize "480x800^" -gravity center -crop 480x800+0+0 +repage 480x800/${f%.*}_480x800.png
done

