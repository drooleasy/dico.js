Dico.js is designed to parse text elements of a page against 
dictionaries and build markup on the matched token while preserving
the surrounding content.

To build Dico.js from the sources you will need to have PHP installed
and enable execution of the build.sh script :

	$ cmod +x build

Then simply run the script from project's root :

	$ ./build.sh
	
It will create a new dico.js file at the root of the project after 
backing any prexisting one.

The doc folder contain a page that serves as presentation and manual.
