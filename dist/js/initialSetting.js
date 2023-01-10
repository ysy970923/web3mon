export var chosenCloth = 1;
import { clothesList } from '../js/clothes';
var renderClothes = function renderClothes() {
  document.querySelector('#clothesBox').innerHTML = '';
  clothesList.forEach(function (item) {
    var img = document.createElement('img');
    img.src = item.source;
    img.style.width = '100px';
    img.style.transition = 'all 0.2s';
    img.style.background = chosenCloth === item.id ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)';
    img.style.boxShadow = '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )';
    img.style.backdropFilter = 'blur( 5px )';
    img.style.borderRadius = '2px';
    img.style.border = '0.6px solid rgba( 255, 255, 255, 0.18 )';
    img.style.margin = '3px';
    img.onclick = function () {
      chosenCloth = item.id;
      renderClothes();
    };
    document.querySelector('#clothesBox').append(img);
  });
};
renderClothes();