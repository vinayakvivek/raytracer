import { Canvas } from "../../core/canvas";
import { IAbstractShape } from "../../models/shape.model";
import { BasicRenderer } from "../../renderer/basic-renderer";
import { WorkerRenderer } from "../../renderer/worker-renderer";
import { random, randomBetween } from "../../utils";
import { SceneCreator } from "./scene-creator";

export class RayTracingInWeekSceneCreator extends SceneCreator {
  _groundBoxes() {
    const material = this.diffuseMaterial([0.48, 0.83, 0.53]);
    const n = 20;
    const w = 100;

    const items: IAbstractShape[] = [];
    for (let i = 0; i < n; ++i) {
      for (let j = 0; j < n; ++j) {
        const h = randomBetween(1, 101);
        const tx = -1000 + i * w;
        const tz = -1000 + j * w;
        const box = this.groupItem("box", material, { size: [w, h, w] }, [
          this.translate(tx, 0, tz),
        ]);
        items.push(box);
      }
    }
    this.group(items);
  }

  _movingSphere() {
    const c1 = [400, 400, 200];
    const c2 = [430, 400, 200];
    const material = this.diffuseMaterial([0.7, 0.3, 0.1]);
    const props = {
      startCenter: c1,
      endCenter: c2,
      radius: 50,
      time: { start: 0, end: 1 },
    };
    this.shape("moving-sphere", material, props);
  }

  _mist() {
    const texture = this.solidTexture([1, 1, 1]);
    const boundary = this.groupItem("sphere", this.glassMaterial(), {
      radius: 5000,
    });
    this.constantMedium(0.0001, texture, boundary);
  }

  _subsurfaceSphere() {
    const boundary = this.shape("sphere", this.glassMaterial(), {
      center: [360, 150, 45],
      radius: 70,
    });
    this.constantMedium(0.2, this.solidTexture([0.2, 0.4, 0.9]), boundary);
  }

  _earth() {
    const texture = this.imageTexture("/textures/earth.jpg");
    const material = this.material("lambertian", texture, {});
    this.shape("sphere", material, { center: [400, 200, 400], radius: 100 });
  }

  _noiseSphere() {
    const texture = this.texture("perlin", { scale: 0.1 });
    const material = this.material("lambertian", texture, {});
    this.shape("sphere", material, { center: [220, 280, 300], radius: 80 });
  }

  _tinySpheres() {
    const white = this.diffuseMaterial([0.73, 0.73, 0.73]);
    const items: IAbstractShape[] = [];
    const ns = 1000;
    const rand = randomBetween;
    for (let i = 0; i < ns; ++i) {
      const s = this.groupItem("sphere", white, {
        center: [rand(0, 165), rand(0, 165), rand(0, 165)],
        radius: 10,
      });
      items.push(s);
    }
    const transforms = [this.rotate("y", 15), this.translate(-100, 270, 395)];
    this.shape("group", null, { shapes: items }, transforms);
  }

  generate() {
    this.camera = {
      position: [478, 278, -600],
      lookAt: [278, 278, 0],
      up: [0, 1, 0],
      vfov: 40,
      aperture: 0.0,
      focusDist: 1.0,
      time: { start: 0, end: 1 },
    };
    this.background = [0, 0, 0];

    // main light
    const lightMat = this.light([7, 7, 7]);
    this.shape("rectangle", lightMat, { width: 300, height: 265, plane: 2 }, [
      this.translate(123, 554, 147),
    ]);

    this._groundBoxes();

    this._movingSphere();

    // glass sphere
    this.shape("sphere", this.glassMaterial(), {
      center: [260, 150, 45],
      radius: 50,
    });

    // metal sphere
    this.shape("sphere", this.metalMaterial([0.8, 0.8, 0.9], 1.0), {
      center: [0, 150, 145],
      radius: 50,
    });

    this._mist();

    this._subsurfaceSphere();

    this._earth();

    this._noiseSphere();

    this._tinySpheres();
  }

  renderScene(canvas: Canvas) {
    this.generate();
    const sceneData = this.exportJson();
    console.log(sceneData);
    const renderer = new BasicRenderer(canvas, sceneData);
    renderer.render();
  }
}
