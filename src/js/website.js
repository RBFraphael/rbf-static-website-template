const { AddOns } = require("./addons");
const { Features } = require("./features");

class WebsiteScripts
{
    constructor()
    {
        new AddOns();
        new Features();
    }
}

new WebsiteScripts();