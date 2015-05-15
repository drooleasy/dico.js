#!/bin/bash

src=src/dico.js.php
target=dico.js
now=$(date +"%Y-%m-%d.%H-%M-%S")
bkup="$target.$now.bkup.js"


if [ -e "$target" ]
then
	mv "$target" "$bkup"
fi
php "$src" > "$target"
