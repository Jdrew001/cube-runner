import * as THREE from 'three';
import 'reflect-metadata';
import { Color, Vector3 } from 'three';

import { BlendFunction, BloomEffect, DepthEffect, DepthOfFieldEffect, EdgeDetectionMode, EffectComposer, EffectPass, KawaseBlurPass, KernelSize, PredicationMode, RenderPass, SMAAEffect, SMAAPreset, TextureEffect, VignetteEffect } from "postprocessing";


import MainScene from './scenes/main.scene';
import { CameraManager } from './managers/camera.manager';
import { Container } from 'typedi';
import GameOptions from './config/options.config';

const width = window.innerWidth;
const height = window.innerHeight;
const cameraManager = Container.get(CameraManager);

const renderer = new THREE.WebGLRenderer({ antialias: true});
cameraManager.initialize();

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = false;
document.body.appendChild( renderer.domElement )

const mainCamera = cameraManager.mainCamera as any;
const mainScene = new MainScene(renderer);
const smaaEffect = new SMAAEffect(
	{
		preset: SMAAPreset.HIGH,
		edgeDetectionMode: EdgeDetectionMode.DEPTH
	}
);

smaaEffect.edgeDetectionMaterial.edgeDetectionThreshold = 0.01;

const depthEffect = new DepthEffect({
	blendFunction: BlendFunction.SKIP
});

// const cocTextureEffect = new TextureEffect({
// 	blendFunction: BlendFunction.SKIP,
// 	texture: depthOfFieldEffect.tex
// });

const renderScene = new RenderPass(mainScene, mainCamera);
renderScene.enabled = true;
const bloom = new BloomEffect({
	resolutionX: window.innerWidth,
	resolutionY: window.innerWidth,
	intensity: 1.4,
	luminanceThreshold: 0.1,
	luminanceSmoothing: 0,
	kernelSize: KernelSize.HUGE
})

const pass = new EffectPass(mainCamera, smaaEffect, bloom)
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(pass);
mainScene.initialize()

function tick()
{
	
	composer.render();
	mainScene.update()
	requestAnimationFrame(tick)
}

tick()
