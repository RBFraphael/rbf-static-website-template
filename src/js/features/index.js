import { GlobalFeatures } from "./global";
import { Loader } from "./loader";

export class Features
{
    constructor()
    {
        new Loader();

        new GlobalFeatures();
    }
}