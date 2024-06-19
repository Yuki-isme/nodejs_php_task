const Controller = require('./Controller');
const { ZingMp3 } = require("zingmp3-api-full")
class ZingMp3Controller extends Controller {
    static async index(req, res) {
        const response = await ZingMp3.getHome();
        let items = response.data.items;
        items.forEach((item) => {
            let classCss = [];
            if (item.sectionType) {
                classCss.push(`zing-mp3-${item.sectionType}`);
            }
            if (item.viewType) {
                classCss.push(`zing-mp3-${item.viewType}`);
            }
            item.classCss = classCss.join(' ');
        });
        await super._index(req, res, 'ZingMp3', {items: items});
    }
}
module.exports = ZingMp3Controller;