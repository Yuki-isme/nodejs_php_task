const ZingMp3 = {
    playSong: async (songId) => {
        if ($('#song_player').data('id') !== songId) {
            await $.ajax({
                url: `/getSong/${songId}`,
                method: 'GET',
                dataType: "JSON",
                success: function (response) {
                    if (response) {
                        let audio = `<audio id="song_player" data-id="${songId}" controls src="${response}"></audio>`;
                        $('#play_zone').html(audio);
                        $('#song_player')[0].play();
                    }
                },
            });
        }
    }
}