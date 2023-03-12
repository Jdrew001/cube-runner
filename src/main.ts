import * as THREE from 'three';
import 'reflect-metadata';
import { Color } from 'three';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import MainScene from './scenes/main.scene';
import { CameraManager } from './managers/camera.manager';
import { Container } from 'typedi';

const width = window.innerWidth;
const height = window.innerHeight;
const cameraManager = Container.get(CameraManager);

const renderer = new THREE.WebGLRenderer();
cameraManager.initialize();

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild( renderer.domElement )

const mainCamera = cameraManager.mainCamera;
const mainScene = new MainScene(renderer);

const renderScene = new RenderPass(mainScene, mainCamera);
const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	1,
	0.4,
	0
  );
bloomPass.clearColor = new Color(0xffffff);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
mainScene.initialize()

function tick()
{
	
	composer.render();
	mainScene.update()
	requestAnimationFrame(tick)
}

tick()
