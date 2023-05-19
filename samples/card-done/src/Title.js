
const { types, div } = require("../../../src/few");

types.title = function (attrs) {
    return div({
        key: "title", // tags can have an id among attributes
        style: {
            width: "100%",
            backgroundColor: attrs.color || "#DEDEFF",
            padding: "10px"
        },
        // attributes can specify event management handlers
        onClick: attrs.onClick,
        // prevents text selection
        onSelectStart: (e) => { e.preventDefault(); }
    })
        // this tag$ is self-closing, like a void tag
        .label$({
            style: { margin: "10%", fontWeight: "bold" },
            inner: attrs.text
        })    // label content
        .$div()         // closes the title div tag
}

module.exports = types.title;
