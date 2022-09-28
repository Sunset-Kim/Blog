require("prismjs/plugins/line-numbers/prism-line-numbers.css");
require("prismjs/plugins/command-line/prism-command-line.css");
require("./src/styles/code.css");
require("./src/styles/code_copy.css");

exports.onRouteUpdate = ({ location, prevLocation }) => {
  console.log("new pathname", location.pathname);
  console.log("old pathname", prevLocation ? prevLocation.pathname : null);
};
