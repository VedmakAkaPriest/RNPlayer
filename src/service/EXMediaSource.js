const xml = require('react-native').NativeModules.RNMXml;


const PATH = 'http://www.ex.ua';
export default class EXMediaSource {
  _categories = [];
  currentCategory = null;
  currentItem = null;

  fetchCategories() {
    const self = this;
    return fetch(PATH + '/ru/video').then(resp => resp.text())
      .then(htmlString => xml.queryHtml(htmlString,
        ["//table[@class='include_0']//a[not(@class='info')]",
          "//table[@class='include_0']//a[not(@class='info')]/@href"]))
      .then(results => {
        self._categories = results[0].map((title, idx) => ({ title, link: results[1][idx] }));
        return self._categories;
      });
  }

  fetchCategoryItems() {
    const self = this;

    return fetch(PATH + this.currentCategory.link).then(resp => resp.text())
      .then(htmlString => xml.queryHtml(htmlString,
        ["//table[@class='include_0']//td/p[1]/a[1]",
          "//table[@class='include_0']//td/a/@href",
          "//table[@class='include_0']//td/a/img/@src"]))
      .then(results => {
        return results[0].map((title, idx) => ({ title, link: results[1][idx], poster: results[2][idx]}));
      });
  }

  fetchItem() {
    const self = this;

    return fetch(PATH + this.currentItem.link).then(resp => resp.text())
      .then(htmlString => xml.queryHtml(htmlString,
        [
          ".//*[@id='body_element']/table[1]//tr/td[1]/h1",
          ".//*[@id='body_element']/table[1]//tr/td[1]/img/@src",
          ".//*[@id='body_element']/table[1]//tr/td[1]/p[position() < last()]",
          ".//*[@id='body_element']/table[3]//tr[position() > 1]/td/a[@title]",
          ".//*[@id='body_element']/table[3]//tr[position() > 1]/td/a[@title]/@href",
          ".//*[@id='body_element']/table[3]//tr[position() > 1]/td[4]/b",
          ".//*[@id='body_element']/table[3]//tr[position() > 1]/td[4]/p[1]/text()"
        ]))
      .then(results => {
        const infos = [];
        for (let idx = 0; idx < results[6].length; idx+=3) {
          infos.push(results[6][idx].trim() + ' - ' + results[6][idx+2].trim());
        }
        let item = {
          title: results[0][0],
          poster: results[1][0],
          details: results[2],
          downloads: results[3].map((title, idx) => ({ title, link: PATH + results[4][idx], size: results[5][idx], info: infos[idx] }))
        };

        return item;
      });
  }
}
