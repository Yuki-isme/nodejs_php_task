require('dotenv').config();

const Common = {
    removeAnchorsPattern: (pattern) => {
        return pattern.replace(/^\^/, '').replace(/\$$/, '');
    },

    compilePattern: (pattern1, pattern2) => {
        return `^${Common.removeAnchorsPattern(pattern1)} ${Common.removeAnchorsPattern(pattern2)}$`;
    },
}

global.Common = Common;