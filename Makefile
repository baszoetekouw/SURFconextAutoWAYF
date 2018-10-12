SRC=src/popup/choose_idp.html src/popup/choose_idp.css src/popup/choose_idp.js src/icons/where-64.png src/icons/where-96.png src/icons/where.png src/contentscript-wayf.js src/manifest.json


.PHONY: all
all: wayfBeGone.xpi

.PHONY: clean
clean:
	-rm -f wayfBeGone.xpi

wayfBeGone.xpi: $(SRC)
	cd src && zip -r ../$@ *
