export class AddOns
{
    constructor()
    {
        this.initLazyload();
    }

    initLazyload()
    {
        if(typeof(window.lazyload) == "undefined"){
            window.lazyload = new LazyLoad();
        }
    
        window.lazyload.update();
        setTimeout(this.initLazyload, 1000);
    }
}