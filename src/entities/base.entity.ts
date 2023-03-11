import * as THREE from 'three';
import Container from "typedi";
import GameOptions from "../config/options.config";
import {MtlObjLoadersService} from "../utils/loaders.util";

export default abstract class BaseEntity {
    
    mtlObjLoadersService = new MtlObjLoadersService();
    protected GAMEOPTIONS = GameOptions;
    group: THREE.Group;

    constructor() { }
    abstract initialize();
    abstract update();
    abstract destroy();
}