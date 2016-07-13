const xml = require('react-native').NativeModules.RNMXml;
import Downloader from './Downloader';


const PATH = 'http://www.ex.ua';
export default class EXMediaSource {
  _categories = [];
  currentCategory = null;
  currentItem = null;

  fetchCategories() {
    const promise = new Promise((resolve, reject) => {
      if (this._categories.length) {
        resolve(this._categories);
      }
      else {
        const self = this;

        fetch(PATH + '/ru/video').then(resp => resp.text()).then(htmlString => {

          xml.queryHtml(htmlString,
            ["//table[@class='include_0']//a[not(@class='info')]", "//table[@class='include_0']//a[not(@class='info')]/@href"],
            (e, results) => {
              if (e || results.length !== 2) {
                return reject(e || "Cann't parse categories!");
              }
              self._categories = results[0].map((title, idx) => ({ title, link: results[1][idx] }));
              resolve(self._categories);
            });
        })
        .catch(reject)
      }
    });

    return promise;
  }

  fetchCategoryItems() {
    const promise = new Promise((resolve, reject) => {
      const self = this;

      fetch(PATH + this.currentCategory.link).then(resp => resp.text()).then(htmlString => {

          xml.queryHtml(htmlString,
            ["//table[@class='include_0']//td/p[1]/a[1]",
              "//table[@class='include_0']//td/a/@href",
              "//table[@class='include_0']//td/a/img/@src"],
            (e, results) => {
              if (e || results.length !== 3) {
                return reject(e || "Cann't parse category items!");
              }
              let items = results[0].map((title, idx) => ({ title, link: results[1][idx], poster: results[2][idx]}));
              resolve(items);
            });
        })
        .catch(reject)
    });

    return promise;
  }

  fetchItem() {
    const promise = new Promise((resolve, reject) => {
      const self = this;

      fetch(PATH + this.currentItem.link).then(resp => resp.text()).then(htmlString => {

          xml.queryHtml(htmlString,
            [
              ".//*[@id='body_element']/table[1]//tr/td[1]/h1",
              ".//*[@id='body_element']/table[1]//tr/td[1]/img/@src",
              ".//*[@id='body_element']/table[1]//tr/td[1]/p[position() < last()]",
              ".//*[@id='body_element']/table[3]//tr[position() > 1]/td/a[@title]",
              ".//*[@id='body_element']/table[3]//tr[position() > 1]/td/a[@title]/@href",
              ".//*[@id='body_element']/table[3]//tr[position() > 1]/td[4]/b",
              ".//*[@id='body_element']/table[3]//tr[position() > 1]/td[4]/p[1]/text()"
            ],
            (e, results) => {
              if (e || results.length < 3) {
                return reject(e || "Cann't parse item!");
              }
              const infos = [];
              for (let idx = 0; idx < results[6].length; idx+=3) {
                infos.push(results[6][idx].trim() + ' - ' + results[6][idx+2].trim());
              }
              let item = {
                title: results[0][0],
                poster: results[1][0],
                details: results[2],
                downloads: results[3].map((title, idx) => ({ title, link: results[4][idx], size: results[5][idx], info: infos[idx] }))
              };
              console.log(item)
              resolve(item);
            });
        })
        .catch(reject)
    });

    return promise;
  }

  download(resourceItem) {
    Downloader.download({link: PATH + resourceItem.link, title: resourceItem.title})
  }
}
