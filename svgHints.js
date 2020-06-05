
export const createHints = options => {

    const svgHolder = document.getElementById(options.svgHolderId);
    svgHolder.insertAdjacentHTML("beforeend",
        `<object id="svg" type="image/svg+xml" data="${options.fileName}"></object>`);

    const mySVG = document.getElementById("svg");

    let svgDoc;

    mySVG.addEventListener("load", () => {
        svgDoc = mySVG.contentDocument;

        options.hintObjects.forEach(object => {

            const activeColor = object.activeColor || options.activeColor;
            const activeColorNames = [activeColor, hex2rgb(activeColor)];

            const passiveColor = object.passiveColor || options.passiveColor;
            const passiveColorNames = [passiveColor, hex2rgb(passiveColor)];

            object.svgIds.forEach(svgId => {
                addHoverListeners(document.getElementById(object.hintId), svgId, activeColorNames, passiveColorNames);
            });
            addSVGHoverListeners(object, activeColorNames, passiveColorNames);
        });
    }, false);

    const hex2rgb = hex => {
        return `rgb(${'0x' + hex[1] + hex[2] | 0}, ${'0x' + hex[3] + hex[4] | 0}, ${'0x' + hex[5] + hex[6] | 0})`;
    }

    const addSVGHoverListeners = (object, activeColorNames, passiveColorNames) => {

        object.svgIds.forEach(svgId => {

            svgDoc.getElementById(svgId).addEventListener("mouseover", event => {
                document.getElementById(object.hintId).style.color = activeColorNames[0];
                object.svgIds.forEach(svgId => {
                    setColor(svgId, activeColorNames[0], passiveColorNames);
                })
            });
            svgDoc.getElementById(svgId).addEventListener("mouseout", event => {
                document.getElementById(object.hintId).style.color = passiveColorNames[0];
                object.svgIds.forEach(svgId => {
                    setColor(svgId, passiveColorNames[0], activeColorNames);
                })
            });
        });
    }

    const addHoverListeners = (element, svgLayerId, activeColorNames, passiveColorNames) => {

        element.addEventListener("mouseover", event => {
            element.style.color = activeColorNames[0];
            setColor(svgLayerId, activeColorNames[0], passiveColorNames);
        });
        element.addEventListener("mouseout", event => {
            element.style.color = passiveColorNames[0];
            setColor(svgLayerId, passiveColorNames[0], activeColorNames);
        });
    }

    const setColor = (_element, color, colorNames) => {

        const element = svgDoc.getElementById(_element);

        function checkChildren(current) {

            const children = Array.from(current.children);

            children.forEach(c => {
                const inColors = colorNames.includes(c?.style?.fill);
                const noStyles = !c?.style?.fill && !c?.style?.stroke;

                if ((c?.style?.fill && inColors) || noStyles) {
                    c.style.fill=color;
                }

                const inColorsStroke = colorNames.includes(c?.style?.stroke);

                if (c?.style?.stroke && inColorsStroke) {
                    c.style.stroke=color;
                }
                checkChildren(c);
            });
        }
        checkChildren(element);
    }

}