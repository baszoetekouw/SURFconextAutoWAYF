.PHONY: all
all: wayfBeGone.xpi

.PHONY: clean
clean:
	-rm -f wayfBeGone.xpi

wayfBeGone.xpi: src/manifest.json
	cd src && zip -r ../$@ *
