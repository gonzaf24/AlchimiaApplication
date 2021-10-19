import React, { Component } from "react";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from "three-orbitcontrols";
import Ini1 from "../../assets/logo-web-laradio.png";
import Ini2 from "../../assets/alchimia_logo1.png";

class Inicio extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.scene = new THREE.Scene();

    //Add Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#e91e63");
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    //add Camera
    this.camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    this.camera.position.z = 20;
    this.camera.position.y = 5;

    //Camera Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    //Simple Box with WireFrame
    this.addModels();

    this.renderScene();
    //start animation
    this.start();
  }

  addModels() {
    // -----Step 1--------
    const geometry1 = new THREE.BoxGeometry(5, 5, 5);
    const material1 = new THREE.MeshBasicMaterial({});

    this.cube1 = new THREE.Mesh(geometry1, material1);
    this.scene.add(this.cube1);

    // -----Step 2--------
    //LOAD TEXTURE and on completion apply it on SPHERE

    new THREE.TextureLoader().load(
      Ini2,
      (texture) => {
        this.cube1.position.setY(8);
        this.cube1.material.map = texture;
        this.cube1.material.needsUpdate = true;
      },
      (xhr) => {},
      (error) => {
        console.log("An error happened" + error);
      }
    );

    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({});

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    new THREE.TextureLoader().load(
      Ini1,
      (texture1) => {
        this.cube.material.map = texture1;
        this.cube.material.needsUpdate = true;
      },
      (xhr) => {
        //Download Progress
        //(xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        //Error CallBack
        console.log("An error happened" + error);
      }
    );
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    // -----Step 3--------
    //Rotate Models
    if (this.cube) this.cube.rotation.y += 0.008;
    if (this.cube1) this.cube1.rotation.y += 0.005;
    if (this.cube) this.cube.rotation.x += 0.005;
    if (this.cube1) this.cube1.rotation.x += 0.008;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
  renderScene = () => {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        style={{ width: "500px", height: "100%" }}
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}
export default Inicio;
