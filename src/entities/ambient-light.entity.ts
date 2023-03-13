import * as THREE from 'three';
import GameOptions from "../config/options.config";

export default class AmbientLightEntity extends THREE.AmbientLightProbe {

    private LIGHT_OPTIONS = GameOptions.LightConfig;
    
    constructor() {
        const lightConfig = GameOptions.LightConfig;
        super(lightConfig.color, lightConfig.intensity);
    }

    initialize() {
    }
}