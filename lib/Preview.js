import * as THREE from 'three'
import * as Exporter from '@doodle3d/threejs-export-obj';

class Preview {
  constructor(canvas, { path, width, height, sceneColor, modelColor, animation, scene } = {}) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setClearColor(sceneColor);
    this.renderer.setSize(width, height);
    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    if (scene) {
      this.scene = scene;
      this.mesh = scene.children[2];
    } else {
      this.scene = new THREE.Scene();
      this.pointLight = new THREE.PointLight(0xffffff, .6);
      this.pointLight.position.set(-50, 5, 50);
      this.ambidentLight = new THREE.AmbientLight(0xffffff, .5);
      this.scene.add(this.pointLight, this.ambidentLight);
      const loader = new THREE.JSONLoader();
      loader.load(path, (geometry) => {
        this.materials = [new THREE.MeshLambertMaterial({
          color: modelColor,
          side: THREE.DoubleSide
        })]
        this.mesh = new THREE.Mesh(geometry, this.materials);
        this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = .8;
        this.mesh.translation = geometry.center();
        this.mesh.rotation.x = .4;
        this.mesh.position.z = -7;
        this.scene.add(this.mesh);
      });
    }
    this.animation = animation;
  }
  mirror(canvas, { width, height }) {
    class Mirror {
      constructor(canvas, { width, height, sceneColor, scene }) {
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setClearColor(sceneColor);
        this.renderer.setSize(width, height);
        this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        this.scene = scene;
      }
      render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
      }
    }
    return new Mirror(canvas, {
      sceneColor: this.renderer.getClearColor(),
      width,
      height,
      scene: this.scene
    });
  }
  clone (canvas, { width, height }) {
    const preview = new Preview(canvas, {
      width,
      height,
      animation: this.animation,
      sceneColor: this.renderer.getClearColor(),
      scene: this.scene
    });
    preview.render();
    return preview;
  }
  get do() {
    const self = this;
    return {
      *rotate(x, y) {
        let cord = yield;
        while (cord) {
          self.rotate((cord.x - x) / 30, (cord.y - y) / 30);
          x = cord.x;
          y = cord.y;
          cord = yield;
        }
      }
    };
  }
  get dom() {
    return this.renderer.domElement;
  }
  set picture(path) {
    const texture = new THREE.TextureLoader().load(path);
    this.front = texture;
  }
  set base64(src) {
    const image = new Image();
    image.src = src;
    const texture = new THREE.Texture();
    texture.image = image;
    image.onload = () => {
      texture.needsUpdate = true;
    };
    this.front = texture;
  }
  set front(texture) {
    texture.offset.set(0, -.38);
    texture.repeat.set(1, .75);
    const material = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true
    });
    this.materials[1] = material;
  }
  set baseColor(color) {
    const material = new THREE.MeshLambertMaterial({
      color: color,
      side: THREE.DoubleSide
    });
    this.materials[0] = material;
  }
  set sceneColor(color) {
    this.renderer.setClearColor(color);
  }
  clear() {
    delete this.materials[1];
  }
  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  rotate(x = 0, y = 0) {
    this.mesh.rotation.x += x;
    this.mesh.rotation.y += y;
  }
  animate() {
    if (this.mesh) {
      this.rotate(0, .02);
    }
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    if (this.animation) {
      this.animate();
    }
    requestAnimationFrame(this.render.bind(this));
  }
  async export() {
    return Exporter.fromMesh(this.mesh);
  }
}

export default Preview;
