<template>
 <div class="wrapp">
  <el-row type="flex" :gutter="8" id="app" class="stretch">
    <el-col :span="18" class="stretch">
      <div class="tool horizontal space around download"></div>
      <el-row type="flex" :gutter="5" class ="grow">
        <el-col :span="2">
        </el-col>
        <el-col :span="14">
          <div id="drawer" ref="drawer" style="width:900px; height: 600px;">
          
            <canvas style="background: url(./img-fons.png); display:none;" id="d2" ref="d2"
              @mousedown="start($event)"
              @mousemove="action($event)"
              @dblclick="focus($event)"
              @mouseup="stop($event)"
              @mouseout="stop($event)">
            </canvas>
            <tui-image-editor ref="tuiImageEditor" @objectAdded="objectAdded" @objectActivated="objectActivated" :options="options"></tui-image-editor>
         
          </div>
        </el-col>
        <div class="red_border"></div>
        <div class="green_border"></div>
        <div class="up_panel"></div>
        
        <div class="down_panel"></div>
      </el-row>
        
    </el-col>
    <el-col :span="6" class="column">
    <div class="fix-3d_tool">
          <div class="tool horizontal space around">
            <div class="button-fix-mini3d">
            
                <el-button class="fix-button__mini" type="text" icon="fa fa-share" @click="cover"> Перегляд <br> на моделі</el-button>
          
                <el-button class="fix-button__mini" type="text" icon="fa fa-pause" @click="animate(false)" v-if="preview.animation"> Старт / <br> Стоп</el-button>
                <el-button class="fix-button__mini" type="text" icon="fa fa-play" @click="animate(true)" v-else> Старт / <br> Стоп</el-button>
                
               
                <el-button class="fix-button__mini" type="text" icon="fa fa-trash" @click="preview.clear()"> Очистити <br> модель </el-button> 
                </div>
                <!--<span class="block title">
                  <el-color-picker v-model="sceneColor" size="mini" @change="changeSceneColor"></el-color-picker>
                  <span class="title"> Scene </span>-->
                </span>
              </div>
              <div id="previewMini" ref="previewMini">
                <canvas id="mini3d" ref="mini3d" @click="show">
                  Sorry your browser doesn't seem to support webgl! :(
                </canvas>
          </div>
      </div>
      <el-button class="btn_downdload" type="text" @click="downloadImage"> Завантажити текстуру </el-button>
      <el-button class="btn_downdload" type="text" @click="$router.push('help')"> Інструкція </el-button>
      <el-dialog
        custom-class="column"
        :visible.sync="dialogVisible"
        :fullscreen="true">
        <span slot="title">
          <order-form :source="source" />
        </span>
        <div id="previewMax" ref="previewMax">
          <canvas id="max3d" ref="max3d"
            @mousedown="grab($event)"
            @mousemove="rotate($event)"
            @mouseup="release($event)">
          </canvas>
        </div>
        <span slot="footer">
          <el-button icon="fa fa-pause" @click="animate(false)" v-if="preview.animation"> Pause </el-button>
          <el-button icon="fa fa-play" @click="animate(true)" v-else> Play </el-button>
          <el-button icon="fa fa-share" @click="cover"> Cover </el-button>
          <el-button icon="fa fa-download" @click="download"> Download </el-button>
          <el-button icon="fa fa-trash" @click="preview.clear()"> Clear </el-button>
          <el-button @click="dialogVisible = false"> Cancel </el-button>
        </span>
      </el-dialog>
      <!-- <transition-group name="flip-list" tag="ul" class="el-upload-list el-upload-list--picture grow">
        <li v-for="(layer, index) in layers" :key="layer.uid" class="el-upload-list__item" :class="selected == index && 'selected'">
          <img
            :src="layer.type == 'picture' ? layer.src : `../assets/img/${layer.type}.png`"
            :alt="layer.name"
            class="el-upload-list__item-thumbnail"
            @click="choose(index)"
          />
          <div class="name">{{ layer.name }}</div>
          <el-button class="button--movingLayers" type="text" icon="fa fa-chevron-up" :disabled="index === 0" @click="raise(index)" />
          <el-button class="button--movingLayers" type="text" icon="fa fa-chevron-down" :disabled="index === layers.length - 1" @click="lower(index)" />
          <i class="fa fa-eye"></i>
          <i class="el-icon-close" @click="remove(index)"></i>
        </li>
      </transition-group> -->
    </el-col>
  </el-row>
    <!--  <div class="help_btn"><i class="fas fa-question"></i></div> -->
  </div>
</template>

<script>
import Drawer from "../lib/Drawer";
import Preview from "../lib/Preview";
import OrderForm from "./OrderForm.vue";
import b64toBlob from "b64-to-blob";
import { saveAs } from "file-saver";
import { ImageEditor } from "@toast-ui/vue-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "../assets/js/reimg";
import { fabric } from "fabric";

let locale_ru_RU = {
  Undo: "Відмінити",
  Redo: "Повторити",
  Tint: "Відтінок",
  Reset: "Скинути",
  Delete: "Видалити",
  DeleteAll: "Видалити все",
  Crop: "Вирізати",
  Flip: "Відобразити",
  Rotate: "Повернути",
  Draw: "Малювати",
  Shape: "Базові фігури",
  Icon: "Нестандартні фігури",
  Text: "Текст",
  Mask: "Завантажити зображення",
  Filter: "Фільтри",
  Custom: "Свій дизайн",
  Apply: "Застосувати",
  Cancel: "Відміна",
  "Flip X": "Відобразити по Х",
  "Flip Y": "Відобразити по Y",
  Square: "Квадрат",
  Range: "Товщина",
  Free: "Довільна",
  Straight: "Пряма",
  Color: "Колір",
  Stroke: "Товщина контура",
  Rectangle: "Прямокутник",
  Circle: "Коло",
  Triangle: "Трикутник",
  Fill: "Заливка",
  "Text size": "Розмір текста",
  Left: "Зліва",
  Right: "Справа",
  Center: "По центру",
  "Load Mask Image": "Завантажити зображення",
  Arrow: "Стрілка",
  "Arrow-2": "Стрілка-2",
  "Arrow-3": "Стрілка-3",
  "Star-1": "Зірка",
  "Star-2": "Зірка-2",
  Polygon: "Багатокутник",
  Location: "Розміщення",
  Heart: "Серде",
  Bubble: "Бульбашка",
  "Custom icon": "Своя іконка",
  Grayscale: "Відтінки сірого",
  Sepia: "Сепія",
    Blur: "Размытие",
    Emboss: "Тиснение",
    Invert: "Інверсія",
    "Sepia2": "Сепия-2",
    Sharpen: "Четкость",
    "Remove White": "Убрать белый",
    Distanse: "Расстояние",
    Brightness: "Яскравість",
    Noise: "Шумы",
    Pixelate: "Пикселизация",
    "Color Filter": "Цветовой фильтр",
    Threshold: "Предел",
    Blend: "Смешивание",
    Multiply: "Перемножить",
};

export default {
  name: "app",
  components: {
    OrderForm,
    "tui-image-editor": ImageEditor,
  },
  data() {
    return {
      useDefaultUI: true,
      options: {
        // for tui-image-editor component's "options" prop
        cssMaxWidth: 700,
        cssMaxHeight: 600,
        includeUI: {
          loadImage: {
            path: "../assets/img/trans.png",
            name: "SampleImage",
          },
          locale: locale_ru_RU,
          menu: ['flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
        },
      },
      dialogVisible: false,
      fonts: [
        "Arial",
        "Comic Sans MS",
        "Georgia",
        "Courier New",
        "Impact",
        "Tahoma",
        "Consolas",
        "Times New Roman",
      ],
      font: {
        color: "#ff0000",
        type: {
          bold: false,
          italic: false,
        },
        family: "Arial",
        size: 45,
      },
      line: {
        color: "#54d595",
        width: 100,
      },
      sceneColor: "#ffffff",
      animation: false,
      mode: 0b0001, /// draw, text, resize, move
      selected: -1,
      preview: {},
      drawer: {},
      layers: [],
    };
  },
  watch: {
    "drawer.layers.observable"() {
      this.layers = this.drawer.layers.array;
    },
  },
  computed: {
    onDraw() {
      return this.mode & 0b1000;
    },
    onText() {
      return this.mode & 0b0100;
    },
    onResize() {
      return this.mode & 0b0010;
    },
    onMove() {
      return this.mode & 0b0001;
    },
    number: {
      get() {
        return this.onText ? this.font.size : this.line.width;
      },
      set(number) {
        if (this.onText) {
          this.font.size = number;
        } else {
          this.line.width = number;
        }
      },
    },
    color: {
      get() {
        return this.onText ? this.font.color : this.line.color;
      },
      set(color) {
        if (this.onText) {
          this.font.color = color;
        } else {
          this.line.color = color;
        }
      },
    },
  },

  methods: {
    async downloadImage() {
      const texture = this.$refs.tuiImageEditor.invoke("toDataURL");
      const match = /(data:.*);.*,(.*)/g.exec(texture);
      const contentType = match[1];
      const data = match[2];
      const blob = b64toBlob(data, contentType);

      saveAs(blob, `image.png`);
    },
    objectActivated(props) {
    //   let elem = document.querySelector(".tui-image-editor-submenu");
    //   elem.classList.remove('visible');
    //   elem.classList.add('hidden');
      /*console.log(props);
      console.log(props.type);
      console.log(props.id);
      const data = document.querySelector(".lower-canvas");
      const cx = data.getContext("2d");

      let imagedata = cx.getImageData(1,1,120,120)
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = imagedata.width;
      canvas.height = imagedata.height;
      ctx.putImageData(imagedata, 0, 0);

      var png = ReImg.fromCanvas(canvas).toPng();
      this.$refs.tuiImageEditor.invoke('addImageObject', png.src);*/
    },
    objectAdded(props) {
      /* let canvas = new fabric.Canvas('can');*/
      console.log(props);
      const data = document.querySelector(".lower-canvas");
      const cx = data.getContext("2d");
      /*var circle = new fabric.Circle({
        radius: 120, fill: 'green', left: 20, top: 0
      });
      canvas.add(circle);
      canvas.renderAll();*/
      let imagedata = cx.getImageData(1, 1, 120, 120);
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      canvas.width = imagedata.width;
      canvas.height = imagedata.height;
      ctx.putImageData(imagedata, 0, 0);

      var png = ReImg.fromCanvas(canvas).toPng();
      this.$refs.tuiImageEditor.invoke("addImageObject", png.src);
      console.log(png);

      cx.putImageData(cx.getImageData(1, 1, 120, 120), 100, 100);
      console.log(cx.getImageData(1, 1, 100, 100));
    },
    animate(animation) {
      this.preview.animation = this.animation = animation;
    },
    changeBaseColor() {
      this.preview.baseColor = this.baseColor;
    },
    changeSceneColor() {
      this.preview.sceneColor = this.sceneColor;
    },
    changeFontType(name) {
      this.font.type[name] = !this.font.type[name];
    },
    changeMode(mode) {
      switch (mode) {
        case "draw":
          this.mode = 0b1000;
          this.drawer.defocus();
          this.selected = -1;
          break;
        case "text":
          this.mode = 0b0100;
          this.drawer.defocus();
          this.selected = -1;
          break;
        case "resize":
          this.mode = 0b0011;
          break;
        case "move":
          this.mode = 0b0001;
          this.drawer.defocus();
          this.selected = -1;
          break;
      }
    },
    async upload(file) {
      await this.drawer.upload(file);
      this.drawer.focus(0);
      this.selected = 0;
      this.changeMode("resize");
    },
    cover() {
      this.preview.base64 = this.$refs.tuiImageEditor.invoke("toDataURL");
    },
    source() {
      return this.drawer.source;
    },
    remove(layer) {
      if (layer == this.selected) {
        this.selected = -1;
      }
      this.drawer.remove(layer);
    },
    raise(layer) {
      if (this.selected == layer) {
        this.selected -= 1;
      } else if (this.selected + 1 == layer) {
        this.selected += 1;
      }
      this.drawer.raise(layer);
    },
    lower(layer) {
      if (this.selected == layer) {
        this.selected += 1;
      } else if (this.selected - 1 == layer) {
        this.selected -= 1;
      }
      this.drawer.lower(layer);
    },
    choose(layer) {
      if (this.selected == layer) {
        this.drawer.defocus(layer);
        this.selected = -1;
        this.changeMode("move");
      } else {
        this.drawer.focus(layer);
        this.selected = layer;
        this.changeMode("resize");
      }
    },
    focus(event) {
      const layer = this.drawer.layer(event.offsetX, event.offsetY);
      this.drawer.focus(layer);
      this.selected = layer;
      this.changeMode("resize");
    },
    conversion(index) {
      this.drawer.conversion(index);
    },
    start(event) {
      if (this.onDraw) {
        return (this.mouse = this.drawer.helpers.draw(
          event.offsetX,
          event.offsetY,
          { style: this.line }
        ));
      }
      if (this.onText) {
        this.keyboard = this.drawer.helpers.text(event.offsetX, event.offsetY, {
          style: this.font,
        });
        return this.keyboard.next();
      }
      if (this.onResize) {
        this.mouse = this.drawer.helpers.resize(event.offsetX, event.offsetY);
        if (this.mouse.next().done) {
          this.mouse = this.drawer.helpers.rotate(event.offsetX, event.offsetY);
          if (!this.mouse.next().done) {
            return;
          }
        } else {
          return;
        }
      }
      if (this.onMove) {
        this.mouse = this.drawer.helpers.move(event.offsetX, event.offsetY);
      }
    },
    action(event) {
      if (this.mouse) {
        this.mouse.next({ x: event.offsetX, y: event.offsetY });
      } else {
        this.hover.next({ x: event.offsetX, y: event.offsetY });
      }
    },
    stop(event) {
      if (this.mouse) {
        this.mouse.next();
        this.mouse = false;
        if (this.onDraw) {
          this.drawer.focus(0);
          this.selected = 0;
          this.changeMode("resize");
        }
      }
    },

    grab(event) {
      this.preview.animation = false;
      this.rotating = this.preview.do.rotate(0, event.offsetX);
    },
    rotate(event) {
      if (this.rotating) this.rotating.next({ x: 0, y: event.offsetX });
    },
    release(event) {
      this.rotating.next();
      this.rotating = false;
      setTimeout(() => {
        this.preview.animation = this.animation;
      }, 1500);
    },
    show() {
      this.dialogVisible = true;
      if (!this.mirror) {
        this.$nextTick(() => {
          this.mirror = this.preview.mirror(this.$refs.max3d, {
            width: this.$refs.previewMax.clientWidth,
            height: this.$refs.previewMax.clientHeight,
          });
          this.mirror.render();
        });
      }
    },
    empty() {},
  },
  created() {
    document.body.addEventListener(
      "keypress",
      ((event) => {
        if (this.onText && this.keyboard) {
          this.keyboard.next(event.key);
        }
      }).bind(this)
    );
    document.body.addEventListener(
      "keydown",
      ((event) => {
        if (this.onText && this.keyboard && event.key == "Backspace") {
          this.keyboard.next(event.key);
        } else if (this.onText && this.keyboard && event.key == "Enter") {
          this.drawer.focus(0);
          this.selected = 0;
          this.changeMode("resize");
        } else if (this.selected != -1 && event.key == "Delete") {
          this.drawer.remove(this.selected);
          this.selected = -1;
        }
      }).bind(this)
    );
  },
  mounted() {
    document.querySelector('.tie-btn-reset').remove();
    document.querySelector('.tui-image-editor-header').remove();
    document.querySelector('.tie-mask-apply').remove();
    document.querySelector('.tie-blur').closest('.tui-image-editor-checkbox').style.display='none';
    document.querySelector('.tie-emboss').closest('.tui-image-editor-checkbox').style.display='none';
    document.querySelector('.tie-vintage').closest('.tui-image-editor-checkbox').style.display='none';
    document.querySelector('.tie-sharpen').closest('.tui-image-editor-checkbox').style.display='none';
    document.querySelector('.tie-remove-white').closest('.tui-image-editor-checkbox-group').style.display='none';
    document.querySelector('.tie-noise').closest('.tui-image-editor-checkbox-group').style.display='none';
    document.querySelector('.tie-pixelate').closest('.tui-image-editor-checkbox-group').style.display='none';
    document.querySelector('.tie-color-filter').closest('.tui-image-editor-checkbox-group').style.display='none';
    document.querySelector('.tie-multiply').closest('.filter-color-item').style.display='none';
    document.querySelector('.tie-blend').closest('.filter-color-item').style.display='none';


    // let inputArray = document.querySelectorAll(
    //   "input.tui-colorpicker-palette-hex"
    // );

    // const delegElem = document.querySelector(".tui-image-editor-menu");

    // delegElem.onclick = (event) => {
    //   let target = event.target; // где был клик?

    //   if (target.tagName != "LI") return;
    //   let elem = document.querySelector(".tui-image-editor-submenu");
    //   elem.classList.remove('hidden');
    //   elem.classList.add('visible');
    // };

    // document
    //   .querySelectorAll("div.tui-colorpicker-container")
    //   .forEach((elem) => {
    //     elem.insertAdjacentHTML(
    //       "beforeend",
    //       `<button id="change_draw">Изменить</button>`
    //     );
    //   });
    // inputArray.forEach((elem) => {
    //   elem.setAttribute("type", "color");
    // });
    // const btn = document.querySelectorAll("#change_draw");
    // function change() {
    //   document
    //     .querySelectorAll(".tui-colorpicker-palette-hex")
    //     .forEach((elem) => {
    //       elem.setAttribute("type", "color");
    //     });
    // }
    // btn.forEach((elem) => {
    //   elem.addEventListener("click", change, false);
    // });

    // document
    //   .querySelector(".tie-btn-rotate")
    //   .insertAdjacentHTML(
    //     "afterend",
    //     '<li class="tui-image-editor-item"><div class="tui-image-editor-icpartition"></div></li>'
    //   );
    // document
    //   .querySelector(".tie-btn-text")
    //   .insertAdjacentHTML(
    //     "afterend",
    //     '<li class="tui-image-editor-item"><div class="tui-image-editor-icpartition"></div></li>'
    //   );

    this.drawer = new Drawer(document.querySelector(".upper-canvas "), {
      width: this.$refs.drawer.clientWidth,
      height: this.$refs.drawer.clientHeight,
      scale: 2,
    });
    this.hover = this.drawer.helpers.hover();
    this.preview = new Preview(this.$refs.mini3d, {
      path: "../assets/models/cup.json",
      width: this.$refs.previewMini.clientWidth,
      height: this.$refs.previewMini.clientHeight,
      sceneColor: this.sceneColor,
      animation: false,
    });
    this.preview.render();
  },
};
</script>


<style>
* {
  box-sizing: border-box;
}
html,
body {
  height: 100%;
  margin: 0;
  background-color: #e8e8e8;
}
body {
  padding: 0 5px 5px;
}
#app {
  height: 100%;
}
#app > * {
  padding: 2.5px 0;
}

.help_btn {
  position: absolute;
  right: 50px;
  bottom: 10px;
  transition: all 0.2s ease-out;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
  border: 1px solid #4b6891;
  width: 50px;
  height: 50px;
}

.tui-image-editor-header-logo {
  display: none;
}

.tui-image-editor-controls {
  background-color: #ffffff !important;
  border-bottom: 2px solid #ff9933;
  border-left: 2px solid #ff9933;
  border-right: 2px solid #ff9933;
}

.tui-image-editor-submenu {
  background-color: #4b68af !important;
}

.tui-image-editor-main-container {
  background-color: #4b68af !important;
}

.tui-colorpicker-palette-button {
  height: 15px;
  width: 15px;
}

/*.color-picker-control {
  width: 380px !important;
}*/

.tui-image-editor-main-container {
  background-color: #e8e8e8 !important;
  //border: 2px solid #4b6891 !important;
  border: 2px solid #ff9933 !important;
}

/* #drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-main.tui-image-editor-menu-draw
  > div.tui-image-editor-submenu
  > div.tui-image-editor-menu-draw
  > ul
  > li:nth-child(3)
  > div
  > div.color-picker-control
  > div.color-picker
  > div
  > div.tui-colorpicker-palette-container
  > ul {
  display: none;
} */
/* 
#drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-main.tui-image-editor-menu-shape
  > div.tui-image-editor-submenu
  > div.tui-image-editor-menu-shape
  > ul
  > li.tie-shape-color-button
  > div.tie-color-fill.tui-image-editor-button
  > div.color-picker-control
  > div.color-picker
  > div
  > div.tui-colorpicker-palette-container
  > ul {
  display: none;
} */

/* #drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-main.tui-image-editor-menu-shape
  > div.tui-image-editor-submenu
  > div.tui-image-editor-menu-shape
  > ul
  > li.tie-shape-color-button
  > div.tie-color-stroke.tui-image-editor-button
  > div.color-picker-control
  > div.color-picker
  > div
  > div.tui-colorpicker-palette-container
  > ul {
  display: none;
} */

/* #drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-main.tui-image-editor-menu-icon
  > div.tui-image-editor-submenu
  > div.tui-image-editor-menu-icon
  > ul
  > li:nth-child(5)
  > div
  > div.color-picker-control
  > div.color-picker
  > div
  > div.tui-colorpicker-palette-container
  > ul {
  display: none;
} */

/* #drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-main.tui-image-editor-menu-text
  > div.tui-image-editor-submenu
  > div.tui-image-editor-menu-text
  > ul
  > li:nth-child(5)
  > div
  > div.color-picker-control
  > div.color-picker
  > div
  > div.tui-colorpicker-palette-container
  > ul {
  display: none;
} */

/* .tui-colorpicker-palette-preview {
  display: none;
} */

/* .tui-image-editor-container .tui-colorpicker-palette-hex {
  margin-top: 0;
} */

#change_draw {
  border-radius: 0 !important;
  background-color: #4b6891 !important;
  color: white !important;
  border: 1px solid #4b6891 !important;
  padding: 7px 40px;
  margin-top: 5px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
}

#change_draw:hover {
  background-color: white !important;
  color: #4b6891 !important;
}

/* #drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-main.tui-image-editor-menu-text
  > div.tui-image-editor-submenu
  > div.tui-image-editor-menu-text
  > ul
  > li:nth-child(5)
  > div
  > div.color-picker-control
  > div.color-picker
  > div
  > div.tui-colorpicker-palette-container
  > ul {
  display: none;
} */

/* .tui-colorpicker-clearfix {
  margin-top: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: none !important;
  background-color: white !important;
} */

/* .tui-colorpicker-palette-hex {
  font-size: 22px !important;
} */
/* 
#drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-main.tui-image-editor-menu-shape
  > div.tui-image-editor-submenu
  > div.tui-image-editor-menu-shape
  > ul
  > li.tie-shape-color-button
  > div.tie-color-stroke.tui-image-editor-button
  > div.color-picker-control
  > div.triangle {
  left: 182px !important;
} */

/* .color-picker-control {
  left: -76px !important;
} */

.use-default {
  fill: #ff9933 !important;
  stroke: #ff9933 !important;
}

.tui-image-editor-container .tui-image-editor-icpartition {
  background-color: #ff9933;
}

#drawer
  > div
  > div.tui-image-editor-controls
  > ul
  > li.tui-image-editor-item.normal.active
  > svg
  > use.active.use-default {
  fill: black !important;
  stroke: black !important;
}

.download {
  border-radius: 0 !important;
}

.tui-image-editor-download-btn {
  visibility: hidden;
  border-radius: 0 !important;
  border: 1px solid #4b6891 !important;
  background-color: #4b6891 !important;
  transition: all 0.2s ease-out;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
}

.tui-image-editor-download-btn:hover {
  border: 1px solid #4b6891 !important;
  background-color: white !important;
  color: #4b6891 !important;
}

/* #drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-header
  > div.tui-image-editor-header-buttons
  > div {
  display: none;
} */

.column {
  display: flex;
  flex-direction: column;
}
.is-fullscreen.column .el-dialog__body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.tui-image-editor{
  margin-bottom: -10px !important;
  border: none;
  background: white;
}
.stretch {
  display: flex;
  height: 100%;
  align-items: stretch;
}
.grow {
  flex-grow: 1;
}
.el-col.stretch {
  display: flex;
  flex-direction: column;
}
.tool .title {
  font-family: Arial;
  font-weight: 500;
  font-size: 14px;
  text-transform: capitalize;
  color: #409eff;
}
.tool.horizontal {
  display: flex;
  align-items: center;
  height: 40px;
  z-index: -1;
}
.tool.horizontal > .block.title {
  display: flex;
  align-items: center;
}
.space.around {
  border: none;
  background: #e8e8e8;
  justify-content: space-around;
}
.tool.vertical {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  width: 37.55em;
  border-bottom: 1px solid #555555;
}
.tool.vertical > * {
  margin: 0;
}
.el-dropdown-menu__item.selected {
  background-color: #d1e7fe !important;
}
.name {
  white-space: nowrap;
  font-family: Open Sans, Arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  padding-right: 15px;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 168px;
}
.el-color-picker__trigger {
  border: none;
}
.el-radio__inner {
  background: blue;
}
#upload > .el-upload,
#upload > .el-upload > .el-upload-dragger {
  width: 100%;
}
#upload > .el-upload > .el-upload-dragger {
  border-radius: 0;
  width: 100%;
  height: auto;
  padding: 4px;
}
#upload .el-upload-dragger .el-icon-upload {
  font-size: 25px;
  margin: 0;
}
.el-upload-dragger {
  background-color: transparent !important;
  border: none !important;
}
#previewMini {
  border: 1px dashed transparent;
  height: 33%;
  cursor: pointer;
  box-sizing: content;
}
#previewMax {
  flex-grow: 1;
}
#drawer {
  height: 400px;
  width: 600px;
  margin: 25px 0;
}
#d2 {
  width: 100%;
  height: 100%;
  border: 3px solid #ff0000;
  outline: 2px dashed #375111;
  outline-offset: -15px;
}
.el-upload-list {
  overflow-y: auto;
  overflow-x: hidden;
  height: 320px;
}
.el-upload-list--picture .el-upload-list__item {
  border-radius: 0;
  border: 1px solid #fff;
  margin: 0;
  padding: 5px 5px 5px 85px;
  height: 65px;
  line-height: 1.3;
}
li.el-upload-list__item:hover {
  border: 1px solid #ff9900;
}
.el-upload-list--picture .el-upload-list__item.selected {
  background-color: #d1e7fe;
  border: 1px solid #336699;
}
.flip-list-move {
  transition: transform 0.5s;
}
*::-webkit-scrollbar {
  width: 10px;
  background-color: white;
}
*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.3);
}
.fix_button {
  margin: 5px 10px 10px 13px !important;
  background: #4b6891;
}
#fix-fs-button {
  font-size: 14px;
}
span#fix-upload {
  background-color: #fff;
  padding: 9px;
  margin-right: 8px;
}
.el-button--text {
  background-color: #ff9933;
  padding: 14px;
  color: #fff;
}
.fa-paint-brush:before {
  color: #3297ff;
  background: #fff;
  padding: 3px;
  margin-right: 2px;
}
.tui-image-editor-canvas-container {
  border: 1px solid red;
}
.fa {
  padding-right: 3px;
}
.el-button {
  font-size: 16px;
  border-radius: none;
}
.figures {
  padding: 11px 15px 15px 14px;
  position: absolute;
  top: 15px;
}
.label_figures {
  padding-left: 35px;
}
.el-upload-dragger .el-icon-upload {
  line-height: 0;
}
.el-icon-upload:before {
  position: relative;
  top: 4px;
}
.el-upload-dragger:after {
  content: "Загрузить";
  font-size: 16px;
}
#fix-fs-button {
  padding: 10px;
}
.stretch.el-col.el-col-18 {
  width: inherit !important;
}
.el-row--flex {
  display: block;
}
#mini3d {
  height: 240px !important;
  width: 264px !important;
  padding: 10px 2px 0 2px;
  margin-bottom: -2px;
}
.el-button + .el-button {
  margin-left: 0 !important;
}
.column.el-col.el-col-6 {
  margin-top: 4.5%;
  width: 270px !important;
}
.fix-3d_tool {
  border: 2px solid #ff9933;
  border-radius: 5px;
  width: 270px !important;
}
.div#app {
  display: flex;
  justify-content: center;
}
.wrapp {
  display: flex;
  justify-content: center;
}
.download {
  margin: 2% 0 -3% 21%;
  display: block;
  width: 70%;
  border: 2px solid #ff9933;
  border-radius: 10px;
  background: #fff;
}
.fix__btn_downdload {
  background-color: #ff9933;
  display: inline-block;
  margin: 3px 50px 3px 220px;
}
.btn_download__text {
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-weight: 500;
  display: inline-block;
  margin: 0 0 0 45px;
}
.btn_downdload {
  width: 270px;
  margin-top: 10px;
  padding: 13px 25px 13px 25px;
  border-radius: 0 !important;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
  transition: all 0.2 easa-out;
  border: 1px solid #ff9933;
}
.btn_downdload:hover {
  background-color: #e8e8e8 !important;
  border-color: #ff9933 !important;
  color: #ff9933;
}
.fix-3d_tool {
  border-radius: 0 !important;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
}
.fix-button__mini {
  border-radius: 0px;
  font-size: 13px;
  padding: 5px;
  background: #ff9933 !important;
}
.el-upload-list--picture .el-upload-list__item-thumbnail {
  margin-top: 4px;
  width: 41px;
  height: 46px;
}
.button--movingLayers {
  font-size: 12px;
  padding: 2px;
  line-height: 1px;
  background: none;
  margin-left: 55px;
}
i.fa.fa-chevron-up {
  color: #b1b6c6;
}
i.fa.fa-chevron-down {
  color: #6ec1ff;
}
.btn-help {
  margin: 6px 0 5px 0;
}
.tui-image-editor-submenu{
  height:120px !important;
}
.tui-image-editor-menu-draw{
  padding-bottom: 12px;
}
.tui-image-editor-submenu-style{
  padding-bottom: 12px !important;
}
.tui-image-editor-menu-draw{
  padding-bottom: 12px !important;
}

.tui-image-editor-menu-shape{
  padding-bottom: 12px !important;
}
.tui-image-editor-menu-text{
  padding-bottom: 12px !important;
}
.button--trigger {
  padding: 5px 4px 4px 3px;
  font-size: 16px;
  background-color: #4b6891 !important;
  border-radius: 0px;
}
.button--trigger:hover .fa-undo {
  color: #3e3b45;
  transition: 0.2s;
}
.fa-undo {
  padding: 4px;
  font-size: 20px;
  background-color: #fff;
  color: #c9c9c8;
  margin-right: 2px;
}
button.el-button.button--trigger.el-button--text:hover .fa-undo {
  color: 3e3b45;
}

.el-button--text {
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25), 0 5px 5px rgba(0, 0, 0, 0.22);
  transition: all 0.2s ease-out;
  border: 1px solid #ff9933;
}

.el-button--text:active,
.el-button--text:focus {
  background-color: #ff9933;
  color: #ffffff;
  border-color: #ff9933;
}

.el-button--text:hover {
  background-color: white !important;
  color: #ff9933;
  border-color: #ff9933;
}

.fa-undo__transform {
  transform: scale(-1, 1);
}
.line_y {
  padding: 12px 0 8px 0;
  margin: 0 5px 0 2px;
  border-right: 2px solid #c8c8c8;
}
.grid {
  display: inline-block;
  background: #fff;
  padding: 10px 6px 7px 0;
}
#grid {
  position: relative;
  bottom: 2px;
  color: #336699;
  font-size: 17px;
  padding: 3px;
}
.el-upload-list__item .el-icon-close {
  position: relative;
  top: 0;
  display: inline-block;
}
i.el-icon-close,
i.fa.fa-eye {
  background: #f2f2f2;
  padding: 8px;
  opacity: 1 !important;
}
.el-icon-close:before {
  color: #c8c8c8;
}
.el-upload-list--picture .el-upload-list__item.selected .el-icon-close:before {
  color: #212128;
}
.el-upload-list--picture .el-upload-list__item .fa-eye,
.el-icon-close {
  color: #c8c8c8;
}
.el-upload-list--picture .el-upload-list__item.selected .fa-eye,
.el-icon-close {
  color: #212128;
}
.text-blue {
  color: #46719f;
}
.text__user {
  font-size: 18px;
  font-family: Arial;
  text-align: center;
  padding: 9px 0;
  margin: 0;
}
.rules {
  background: #fff;
  margin-top: 40px;
  position: relative;
  padding-bottom: 15px;
}
.designations {
  font-size: 18px;
  font-family: Arial, sans-serif;
  font-weight: bold;
  padding: 5px 20px;
}
.rules__line {
  margin-bottom: 30px;
  opacity: 0.7;
  width: 85%;
}
.rules-designations--text {
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  padding-left: 20px;
}
.rules__print {
  line-height: 0.2;
}
.green__line {
  border-bottom: 3px dashed #017800;
  position: absolute;
  left: 170px;
  bottom: 73px;
  width: 80px;
}
.red__line {
  border-bottom: 2px solid #ff0000;
  position: absolute;
  left: 170px;
  bottom: 33px;
  width: 80px;
}
.tool__user {
  background: #fff;
  padding: 0 15px;
  height: 190px;
  position: relative;
  margin-bottom: 30px;
}
.tool__user__border {
  padding: 65px 0 85px 0;
  margin: 0px 6px 0 6px;
  border-right: 1px solid #ccc;
  position: relative;
  top: 60px;
}
.el-input-number--mini {
  width: 105px;
}
.user__zoom::-webkit-inner-spin-button {
  opacity: 1;
  padding: 3px;
  background-color: #fff !important;
  color: #0a0a0a;
  height: 25px;
  margin: 0;
}
.user__zoom {
  padding: 7px 0 7px 3px;
  border: 2px solid #cacaca;
  box-shadow: 1px 2px 2px #f3f3f3;
  text-align: center;
  margin-top: 5px;
}
.user__zoom__text {
  font-family: Arial, sans-serif;
  font-size: 16px;
  display: inline-block;
}
.tool__user__zoom {
  display: inline-block;
  position: absolute;
  top: 130px;
  left: 12px;
}
.visible{
  visibility: visible;
}
.hidden{
  visibility: hidden;
}
.user__rotate {
  display: inline-block;
  display: inline-block;
  position: absolute;
  left: 17px;
  font-size: 27px;
  top: 48px;
}
.user__zoom__text-rotate {
  display: inline-block;
  position: absolute;
  top: 82px;
  left: 15px;
  font-size: 16px;
  font-family: Arial;
}
.el-input__inner {
  background: #fff !important;
}

.el-select {
  margin-top: 15px;
  width: 26%;
}
.el-dropdown-menu {
  display: inline-block;
  margin: 0;
  padding: 0;
  box-shadow: none;
  top: 68px;
  left: 96px;
}
.fix__display {
  display: inline-block !important;
  width: 100%;
  position: absolute;
  top: 785px;
  left: -85px;
}
.container_dropdown_menu {
  display: inline-block;
}
.el-dropdown-menu {
  border: none;
}
.el-dropdown-menu__item {
  float: left;
  padding: 0 3px;
  font-size: 16px;
  color: #5a5e66;
}
.container-input-number {
  display: inline-block;
  position: absolute;
  left: 92px;
  top: 70%;
}
.AV {
  display: inline-block;
  margin: 0;
  line-height: 1;
  border-bottom: 2px solid #a7a7a7;
}
.big__T {
  display: inline-block;
  font-size: 26px;
  position: relative;
  top: 5px;
  margin: 0;
  font-family: Arial;
  font-weight: bold;
}
.small__T {
  display: inline-block;
  font-size: 13px;
  margin: 0;
  font-family: Arial;
  position: relative;
  top: 5px;
  left: 5px;
  font-weight: bold;
}
.el-color-dropdown__main-wrapper {
  display: flex;
  position: absolute;
  width: 70%;
}
.el-color-hue-slider.is-vertical {
  position: relative;
  left: 207px;
}
.el-color-picker__panel {
  padding: 0;
  display: block !important;
  border: 0;
  box-shadow: none;
}
.el-color-dropdown__btns {
  display: block;
}
.color-user--button {
  display: inline-block;
  float: right;
  margin-right: -12px;
}
.blocking,
.el-color-picker--mini .el-color-picker__trigger {
  position: absolute;
  height: 23px;
  width: 55px;
  left: 279px;
  top: 40px;
  padding: 0;
  border: 1px solid #cccccc;
  border-radius: 0;
}
.el-col-6 {
  width: 22.5% !important;
}
.blocking {
  position: absolute;
  z-index: 55;
  left: 547px;
  top: 45px;
}
.el-color-picker__icon.el-icon-arrow-down {
  display: none;
}

.color_text__button {
  position: relative;
  bottom: 2px;
  right: 8px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  font-weight: 500;
}
.el-color-picker__color {
  border: 0;
  border-radius: 0;
}
.transperant__block {
  position: absolute;
  top: 67px;
  right: 4px;
  height: 23px;
  width: 55px;
  padding: 0;
  border: 1px solid #cccccc;
}
.color_text__button__old {
  position: relative;
  top: 19px;
  left: -62px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  font-weight: 500;
}
.button__success {
  display: block;
  position: relative;
  top: 50px;
  left: 15px;
}
.is-plain span {
  text-transform: lowercase;
}
.transparent__span {
  background-color: black;
  height: 20px;
}
.el-input--mini {
  display: none;
}
.el-color-dropdown__link-btn {
  display: none;
}
button.el-button.el-color-dropdown__btn.el-button--default.el-button--mini.is-plain {
  position: absolute;
  top: 140px;
  right: -30px;
  padding: 5px;
  border: 2px solid #ff9933;
  border-radius: 5px;
}
.transparent__background {
  position: absolute;
  top: -10px;
  left: 55px;
  padding: 10px;
  border: 2px solid #46c3e0;
}
.color_text__transparent {
  position: relative;
  top: -7px;
  left: -30px;
  font-size: 14px;
  font-family: Arial, sans-serif;
  font-weight: 500;
}

.tui-image-editor-container .color-picker-control {
  width: 380px;
}

.tui-image-editor-menu-filter .tui-image-editor-submenu-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tui-image-editor-canvas-container {
  border: none;
}

.tui-image-editor-container .tui-image-editor-checkbox-wrap {
  display: flex !important;
  flex-direction: column;
}

.tool.horizontal.space.around.download {
  display: none;
}

/* #drawer
  > div
  > div.tui-image-editor-main-container
  > div.tui-image-editor-main.tui-image-editor-menu-draw
  > div.tui-image-editor-submenu
  > div.tui-image-editor-menu-draw
  > ul
  > li:nth-child(3)
  > div
  > div.color-picker-control
  > div.color-picker
  > div
  > div.tui-colorpicker-palette-container.tui-view-2
  > ul {
  visibility: hidden;
  display: none;
} */
</style>
