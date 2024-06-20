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
            let itemsPath = path.join(__dirname, `../views/ZingMp3/sectionType/${item.sectionType}/items.ejs`);
            let sectionTypeData = {};
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
                            let newReleaseContent = ``;
                            let itemPath = path.join(__dirname, `../views/ZingMp3/sectionType/${item.sectionType}/item.ejs`);
                            for (const [newReleaseKey, newReleaseValue] of Object.entries(value)) {
                                //item.ejs
                                let newReleaseData = { src: newReleaseValue.thumbnail, href: newReleaseValue.link };
                                newReleaseContent += await super._renderEjsFile(itemPath, newReleaseData);
                            }
                            data = {...data, content: newReleaseContent, key: key};
                            break;
                        case 'newReleaseChart':
                            break;
                        case 'RTChart':
                            break;
                        case 'weekChart':
                            break;
                        case 'adBanner':
                            data = {...data, src: value.thumbnail, href: value.link, title: value.title};
                            break;
                        case 'livestream':
                            data = {...data, src: value.thumbnail, href: value.link, title: value.title};
                            break;
                        case 'playlist':
                            switch (item.sectionId) {
                                case 'hEditorTheme':
                                    data = {...data, src: value.thumbnail, href: value.link};
                                    break;
                                case 'hEditorTheme3':
                                    data = {...data, src: value.thumbnail, href: value.link};
                                    break;
                                case 'hSeasonTheme':
                                    data = {...data, src: value.thumbnail, href: value.link};
                                    break;
                                case 'h100':
                                    data = {...data, src: value.thumbnail, href: value.link};
                                    break;
                                case 'hAlbum':
                                    data = {...data, src: value.thumbnail, href: value.link};
                                    break;
                                default:
                                    console.log('No section id!');
                                    break;
                            }
                            indexKey = `${item.sectionType}_${item.sectionId}`;
                            break;
                        default:
                            console.log('No section type!');
                            break;
                    }
                    value.content = await super._renderEjsFile(itemsPath, data);
                    content += value.content;
                }
            }

            sectionTypeData.title = item.title;
            sectionTypeData.content = content;

            item.content = await super._renderEjsFile(sectionTypePath, sectionTypeData);
            contentSectionType[indexKey] = item.content;
        }

        await super._index(req, res, 'ZingMp3', { items: items, content: contentSectionType });
    }
}

module.exports = ZingMp3Controller;


