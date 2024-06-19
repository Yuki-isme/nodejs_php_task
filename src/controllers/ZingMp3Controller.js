const Controller = require('./Controller');
const { ZingMp3 } = require("zingmp3-api-full");
const path = require("node:path");

class ZingMp3Controller extends Controller {
    static async index(req, res) {
        const response = await ZingMp3.getHome();
        let items = response.data.items;
        let contentSectionType = {};

        for (const [index, item] of Object.entries(items)) {
            console.log(`${index}: `, {sectionType: item.sectionType, viewType: item.viewType, sectionId: item.sectionId, title: item.title, type: typeof item.items !== "undefined"});

            let classCss = [];
            if (item.sectionType) {
                classCss.push(`zing-mp3-${item.sectionType}`);
            }
            if (item.viewType) {
                classCss.push(`zing-mp3-${item.viewType}`);
            }
            item.classCss = classCss.join(' ');

            let indexKey = `${item.sectionType}`;
            let content = ``;
            let sectionTypePath = path.join(__dirname, `../views/ZingMp3/sectionType/${item.sectionType}/${item.sectionType}.ejs`);
            let itemPath = path.join(__dirname, `../views/ZingMp3/sectionType/${item.sectionType}/item.ejs`);
            if (typeof item.items !== "undefined") {
                for (const [key, value] of Object.entries(item.items)) {
                    let data = {}
                    switch (item.sectionType) {
                        case 'banner':
                            data = {...data, src: value.banner, href: value.link};
                            break;
                        case 'recentPlaylist':
                            break;
                        case 'new-release':
                            break;
                        case 'bewReleaseChart':
                            break;
                        case 'RTChart':
                            break;
                        case 'weekChart':
                            break;
                        case 'adBanner':
                            break;
                        case 'livestream':
                            break;
                        case 'playlist':
                            data = {...data, title: value.title};
                            indexKey = `${item.sectionType}_${item.sectionId}`;
                            switch (item.sectionId) {
                                case 'hEditorTheme':
                                    break;
                                case 'hEditorTheme3':
                                    break;
                                case 'hSeasonTheme':
                                    break;
                                case 'h100':
                                    break;
                                case 'hAlbum':
                                    break;
                                default:
                                    console.log('No section id!');
                                    break;
                            }
                            break;
                        default:
                            console.log('No section type!');
                            break;
                    }
                    value.content = await super._renderEjsFile(itemPath, data);
                    content += value.content;
                }
            }

            item.content = await super._renderEjsFile(sectionTypePath, { content: content });
            contentSectionType[indexKey] = item.content;
        }

        await super._index(req, res, 'ZingMp3', { items: items, content: contentSectionType });
    }
}

module.exports = ZingMp3Controller;


