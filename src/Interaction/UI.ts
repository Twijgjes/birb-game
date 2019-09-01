import * as dat from 'dat.gui';

export function initUI() {
  return new dat.GUI();
}

export function initChooseSceneUI(gui: dat.GUI) {
  const csF = gui.addFolder("Choose a scene");
  const chooseSceneMenu = {
    demo: function() {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("scene", "demo");
      window.location.search = urlParams.toString();
    },
    sandbox: function() {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("scene", "sandbox");
      window.location.search = urlParams.toString();
    },
    zen: function() {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("scene", "zen");
      window.location.search = urlParams.toString();
    },
  };
  csF.add(chooseSceneMenu, 'demo');
  csF.add(chooseSceneMenu, 'sandbox');
  csF.add(chooseSceneMenu, 'zen');
}

export function initUtilityButtons(gui: dat.GUI) {
  const mainButtons = {
    "switch fullscreen": function() {
      if (!document.fullscreen) {
        document.body.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
    info: function() {
      alert(
        "Hello! This is a little experiment by me. It's not a game (yet?)," +
        " just something interesting to play around with. " +
        "Everything you see is randomly generated.\n\n" +
        "Mobile controls: you can \"fly\" around by pointing " +
        "your phone in the direction you want to look at. " +
        "Touch the screen to move forward." +
        "\n\nLaptop/desktop controls: left click and hold to move the camera. " +
        "Use the WASD keys to move forward, backward, left and right."
      );
    }
  }
  gui.add(mainButtons, "switch fullscreen");
  gui.add(mainButtons, "info");
}